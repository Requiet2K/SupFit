package com.project.supplement.dto.request;

import lombok.*;

@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class changePasswordDTO {
    private String currentPassword;
    private String newPassword;
}
