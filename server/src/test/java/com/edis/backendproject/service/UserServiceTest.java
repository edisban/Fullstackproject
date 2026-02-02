package com.edis.backendproject.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Objects;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.edis.backendproject.dto.RegisterRequest;
import com.edis.backendproject.model.User;
import com.edis.backendproject.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @SuppressWarnings("null")
    @Test
    void registerUserPersistsHashedPassword() {
        RegisterRequest request = new RegisterRequest("alice", "plaintextPass");
        when(passwordEncoder.encode("plaintextPass")).thenReturn("hashed");
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        when(userRepository.save(userCaptor.capture())).thenAnswer(invocation -> {
            User toSave = invocation.getArgument(0, User.class);
            return Objects.requireNonNull(toSave);
        });
        when(userRepository.save(userCaptor.capture())).thenAnswer(invocation -> Objects.requireNonNull(invocation.getArgument(0)));

        User created = userService.registerUser(request);
        User safeCreated = Objects.requireNonNull(created);

        assertThat(safeCreated.getUsername()).isEqualTo("alice");
        assertThat(safeCreated.getPassword()).isEqualTo("hashed");
        verify(passwordEncoder).encode("plaintextPass");
        verify(userRepository).save(userCaptor.getValue());
    }

    @Test
    void registerUserWhenUsernameExistsThrowsIllegalArgumentException() {
        RegisterRequest request = new RegisterRequest("taken", "plaintextPass");
        when(userRepository.existsByUsername("taken")).thenReturn(true);

        assertThatThrownBy(() -> userService.registerUser(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Username is already taken");
    }

    @Test
    void deleteUserByUsernameRemovesRecordWhenPresent() {
        User existing = User.builder().id(42L).username("alice").password("hash").role("USER").build();
        User safeExisting = Objects.requireNonNull(existing);
        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(safeExisting));

        userService.deleteUserByUsername("alice");

        verify(userRepository).findByUsername("alice");
        verify(userRepository).delete(safeExisting);
    }

    @Test
    void deleteUserByUsernameThrowsWhenMissing() {
        when(userRepository.findByUsername("missing")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.deleteUserByUsername("missing"))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("User not found");
    }
}
