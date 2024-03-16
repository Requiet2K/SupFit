package com.project.supplement.dto.request;

import lombok.*;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class updateUserDTO {
    private String gender;
    private LocalDate birthDate;
    private String phoneNumber;
}
