package com.ecommerce.paymentservice.controller;

import com.ecommerce.paymentservice.dto.PaymentRequest;
import com.ecommerce.paymentservice.dto.PaymentResponse;
import com.ecommerce.paymentservice.exception.ForbiddenOperationException;
import com.ecommerce.paymentservice.service.PaymentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@Tag(name = "Payment Management", description = "APIs for payment processing and retrieval")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    @Operation(summary = "Process a payment", description = "Validates the user against user-service, then processes the payment for the given order.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Payment processed successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "503", description = "User service unavailable")
    })
    public ResponseEntity<PaymentResponse> processPayment(@Valid @RequestBody PaymentRequest request, Authentication authentication) {
        Long requesterUserId = getRequesterUserId(authentication);
        boolean isAdmin = isAdmin(authentication);
        if (isAdmin) {
            throw new ForbiddenOperationException("Admin users do not make payments");
        }
        if (!requesterUserId.equals(request.getUserId())) {
            throw new ForbiddenOperationException("You can only create payments for your own account");
        }
        PaymentResponse response = paymentService.processPayment(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Internal: Process a payment (no auth required)
     * POST /payments/internal
     * Intended for inter-service communication over Kubernetes DNS.
     */
    @PostMapping("/internal")
    @Operation(summary = "Process a payment (internal)", description = "Internal endpoint for inter-service calls. No JWT required.")
    public ResponseEntity<PaymentResponse> processPaymentInternal(@Valid @RequestBody PaymentRequest request) {
        // Skips the JWT and Admin checks, relies on internal network routing
        PaymentResponse response = paymentService.processPayment(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get payment by ID")
    public ResponseEntity<PaymentResponse> getPaymentById(@Parameter(description = "Payment ID", example = "1") @PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }

    @GetMapping("/order/{orderId}")
    @Operation(summary = "Get payments by order ID")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByOrderId(@Parameter(description = "Order ID", example = "1") @PathVariable Long orderId) {
        return ResponseEntity.ok(paymentService.getPaymentsByOrderId(orderId));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get payments by user ID")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByUserId(@Parameter(description = "User ID", example = "1") @PathVariable Long userId, Authentication authentication) {
        Long requesterUserId = getRequesterUserId(authentication);
        if (!isAdmin(authentication) && !requesterUserId.equals(userId)) {
            throw new ForbiddenOperationException("You can only view your own payment history");
        }
        return ResponseEntity.ok(paymentService.getPaymentsByUserId(userId));
    }

    @GetMapping
    @Operation(summary = "Get all payments")
    public ResponseEntity<List<PaymentResponse>> getAllPayments(Authentication authentication) {
        if (!isAdmin(authentication)) {
            throw new ForbiddenOperationException("Only admin users can view all payments");
        }
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
    }

    private Long getRequesterUserId(Authentication authentication) {
        return (Long) authentication.getDetails();
    }

    @GetMapping("/health")
    @Operation(summary = "Health check")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Payment Service is running!");
    }
}