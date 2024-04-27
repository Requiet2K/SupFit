package com.project.supplement.dto;

import com.project.supplement.dto.request.cartItemsDTO;
import com.project.supplement.dto.request.productDTO;
import com.project.supplement.dto.response.productResponse;
import com.project.supplement.entity.Address;
import com.project.supplement.entity.Cart;
import com.project.supplement.entity.Product;
import com.project.supplement.security.Role;
import lombok.*;
import org.springframework.lang.Nullable;

import javax.validation.constraints.Null;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

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
    private List<Address> addresses;
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
