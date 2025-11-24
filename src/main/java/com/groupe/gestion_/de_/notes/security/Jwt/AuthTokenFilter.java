package com.groupe.gestion_.de_.notes.security.Jwt;

import com.groupe.gestion_.de_.notes.security.SecurityUserService.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class AuthTokenFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

    private final JwtUtils jwtUtils;
    private final UserDetailsServiceImpl userDetailsService;

    public AuthTokenFilter(JwtUtils jwtUtils, UserDetailsServiceImpl userDetailsService) {
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = parseJwt(request);
            logger.info("Processing request: {} {}, JWT present: {}", request.getMethod(), request.getRequestURI(), jwt != null);
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                String username = jwtUtils.getUserNameFromJwtToken(jwt);
                
                // Extraire les rôles du token JWT
                Claims claims = Jwts.parserBuilder()
                    .setSigningKey(jwtUtils.key())
                    .build()
                    .parseClaimsJws(jwt)
                    .getBody();
                    
                String roles = claims.get("roles", String.class);
                List<SimpleGrantedAuthority> authorities;
                if (roles != null && !roles.trim().isEmpty()) {
                    authorities = Arrays.stream(roles.split(","))
                        .map(role -> {
                            String trimmedRole = role.trim();
                            // Enlever le préfixe ROLE_ si présent car Spring Security l'ajoute automatiquement
                            if (trimmedRole.startsWith("ROLE_")) {
                                trimmedRole = trimmedRole.substring(5);
                            }
                            return new SimpleGrantedAuthority("ROLE_" + trimmedRole);
                        })
                        .collect(Collectors.toList());
                } else {
                    authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));
                }
                
                logger.info("JWT Authentication - Username: {}, Roles: {}, Authorities: {}", username, roles, authorities);

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        username, null, authorities);
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (io.jsonwebtoken.UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (io.jsonwebtoken.MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (io.jsonwebtoken.SignatureException e) {
            logger.error("Invalid JWT signature: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }
}
