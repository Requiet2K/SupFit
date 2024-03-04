package com.project.supplement.dto;

import com.project.supplement.security.Role;
import lombok.*;
import org.springframework.lang.Nullable;

import javax.validation.constraints.Null;
import java.util.Date;

@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;
    @Nullable
    private String address;
    @Nullable
    private Date birthDay;
    @Nullable
    private String gender;
    @Nullable
    private String phoneNumber;
}
