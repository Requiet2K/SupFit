package com.project.supplement.dto.request;

import com.project.supplement.dto.response.productResponse;
import com.project.supplement.entity.Address;
import com.project.supplement.security.Role;
import lombok.*;
import org.springframework.lang.Nullable;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

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
    private Set<Address> addresses;
    @Nullable
    private LocalDate birthDate;
    @Nullable
    private String gender;
    @Nullable
    private String phoneNumber;
    @Nullable
    private List<productResponse> favorites;
    private List<cartItemsDTO> cartItems;
}
