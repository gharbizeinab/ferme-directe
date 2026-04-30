// src/main/java/com/FermeDirecte/FermeDirecte/controller/ProductController.java
package com.FermeDirecte.FermeDirecte.controller;

import com.FermeDirecte.FermeDirecte.dto.product.ProductRequest;
import com.FermeDirecte.FermeDirecte.dto.product.ProductResponse;
import com.FermeDirecte.FermeDirecte.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "dateCreation") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return ResponseEntity.ok(
                productService.listerProduits(pageable)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    @GetMapping("/seller/my-products")
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    public ResponseEntity<List<ProductResponse>> getMyProducts(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                productService.listerMesProduitsSimple(userDetails.getUsername())
        );
    }

    @GetMapping("/seller/my-products-paginated")
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    public ResponseEntity<Page<ProductResponse>> getMyProductsPaginated(
            @AuthenticationPrincipal UserDetails userDetails,
            Pageable pageable) {

        return ResponseEntity.ok(
                productService.listerMesProduits(userDetails.getUsername(), pageable)
        );
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody ProductRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(productService.creer(request, userDetails.getUsername()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                productService.modifier(id, request, userDetails.getUsername())
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        productService.desactiver(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle")
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    public ResponseEntity<ProductResponse> toggleProduct(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        productService.desactiver(id);
        return ResponseEntity.ok(productService.getById(id));
    }
}