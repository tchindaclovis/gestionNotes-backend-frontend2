package com.groupe.gestion_.de_.notes.services.ServiceImplementation;

import com.groupe.gestion_.de_.notes.exceptions.BadRequestException;
import com.groupe.gestion_.de_.notes.exceptions.ResourceNotFoundException;
import com.groupe.gestion_.de_.notes.model.Subject;
import com.groupe.gestion_.de_.notes.dto.SubjectRequest;
import com.groupe.gestion_.de_.notes.dto.SubjectResponse;
import com.groupe.gestion_.de_.notes.repository.SubjectRepository;
import com.groupe.gestion_.de_.notes.services.ServiceInterface.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;

    /**
     * Creates a new subject.
     * Validates that the subject code and name are unique.
     * @param request The DTO containing subject details.
     * @return The created SubjectResponse DTO.
     * @throws BadRequestException if subject code or name already exists.*/

    @Override
    @Transactional
    public SubjectResponse addSubject(SubjectRequest request) {
        if (subjectRepository.existsBySubjectCode(request.getSubjectCode())) {
            throw new BadRequestException("Subject with code " + request.getSubjectCode() + " already exists.");
        }
        if (subjectRepository.existsByName(request.getName())) {
            throw new BadRequestException("Subject with name " + request.getName() + " already exists.");
        }

        Subject subject = Subject.builder()
                .subjectCode(request.getSubjectCode())
                .name(request.getName())
                .coefficient(request.getCoefficient())
                .description(request.getDescription())
                .build();

        Subject savedSubject = subjectRepository.save(subject);
        return mapSubjectToResponse(savedSubject);
    }

    /**
     * Retrieves a subject by its ID.
     * @param SubjectCode The ID of the subject.*/
     // @return An Optional containing the SubjectResponse DTO if found, empty otherwise.
    @Override
    @Transactional(readOnly = true)
    public Optional<SubjectResponse> findBySubjectCode(String SubjectCode) {
        return subjectRepository.findBySubjectCode(SubjectCode)
                .map(this::mapSubjectToResponse);
    }


     // Retrieves all subject records.
     // @return A list of SubjectResponse DTOs.

    @Override
    @Transactional(readOnly = true)
    public List<SubjectResponse> getAllSubjects() {
        return subjectRepository.findAll().stream()
                .map(this::mapSubjectToResponse)
                .collect(Collectors.toList());
    }


    /**
     * Retrieves a subject by its unique name.
     * @param name The subject name.*/
     // @return An Optional containing the SubjectResponse DTO if found, empty otherwise.

    @Override
    @Transactional(readOnly = true)
    public Optional<SubjectResponse> findBySubject_Name(String name) {
        return subjectRepository.findByName(name)
                .map(this::mapSubjectToResponse);
    }


     //Updates an existing subject.
     // Validates that the updated subject code and name remain unique (excluding the current subject itself).
     /** @param subjectCode The code of the subject to update.
      @param request The DTO containing updated subject details.*/
     //@return The updated SubjectResponse DTO.
     //@throws ResourceNotFoundException if the subject is not found.
     //@throws BadRequestException if the updated subject code or name conflicts with another subject.

    @Override
    @Transactional
    public SubjectResponse updateSubject(String subjectCode, SubjectRequest request) {
        Subject existingSubject = subjectRepository.findBySubjectCode(subjectCode)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with ID: " + subjectCode));

        // Check for uniqueness of subjectCode, excluding the current subject itself
        if (!existingSubject.getSubjectCode().equals(request.getSubjectCode()) &&
                subjectRepository.existsBySubjectCode(request.getSubjectCode())) {
            throw new BadRequestException("Subject with code " + request.getSubjectCode() + " already exists.");
        }

        // Check for uniqueness of name, excluding the current subject itself
        if (!existingSubject.getName().equals(request.getName()) &&
                subjectRepository.existsByName(request.getName())) {
            throw new BadRequestException("Subject with name " + request.getName() + " already exists.");
        }

        existingSubject.setSubjectCode(request.getSubjectCode());
        existingSubject.setName(request.getName());
        existingSubject.setCoefficient(request.getCoefficient());
        existingSubject.setDescription(request.getDescription());

        Subject updatedSubject = subjectRepository.save(existingSubject);
        return mapSubjectToResponse(updatedSubject);
    }


     /** Deletes a subject by its ID.*/
     //@param id The ID of the subject to delete.
     //@throws ResourceNotFoundException if the subject is not found.

    @Override
    @Transactional
    public void deleteSubject(Long id) {
        if (!subjectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Subject not found with ID: " + id);
        }
        // TODO: Add check here if subject has associated grades or class_subjects before deleting
        // If it does, consider throwing a BadRequestException or handling cascade deletion.
        subjectRepository.deleteById(id);
    }

    // --- Helper Methods ---
     //Maps a Subject entity to a SubjectResponse DTO.
     //@param subject The Subject entity to map.
     //@return The SubjectResponse DTO.

    private SubjectResponse mapSubjectToResponse(Subject subject) {
        return SubjectResponse.builder()
                .id(subject.getId())
                .subjectCode(subject.getSubjectCode())
                .name(subject.getName())
                .coefficient(subject.getCoefficient())
                .description(subject.getDescription())
                .build();
    }
}
