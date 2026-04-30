package com.FermeDirecte.FermeDirecte.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // -------------------------------------------------------
    // Standard error response body
    // -------------------------------------------------------
    @Data
    @AllArgsConstructor
    public static class ApiError {
        private int status;
        private String error;
        private String message;
        private LocalDateTime timestamp;
    }

    @Data
    @AllArgsConstructor
    public static class ValidationApiError {
        private int status;
        private String error;
        private Map<String, String> fieldErrors;
        private LocalDateTime timestamp;
    }

    // -------------------------------------------------------
    // Handlers
    // -------------------------------------------------------

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(ResourceNotFoundException ex) {
        log.warn("Ressource non trouvée: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ApiError(404, "Ressource non trouvée", ex.getMessage(), LocalDateTime.now()));
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiError> handleBadRequest(BadRequestException ex) {
        log.warn("Requête invalide: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ApiError(400, "Requête invalide", ex.getMessage(), LocalDateTime.now()));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError> handleAccessDenied(AccessDeniedException ex) {
        log.warn("Accès refusé: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(new ApiError(403, "Accès refusé", 
                "Vous n'avez pas les permissions nécessaires pour effectuer cette action.", 
                LocalDateTime.now()));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiError> handleBadCredentials(BadCredentialsException ex) {
        log.warn("Tentative de connexion échouée");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new ApiError(401, "Authentification échouée", 
                "Email ou mot de passe incorrect. Veuillez vérifier vos identifiants.", 
                LocalDateTime.now()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationApiError> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String field = ((FieldError) error).getField();
            String message = error.getDefaultMessage();
            errors.put(field, message);
        });
        log.warn("Erreur de validation: {}", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ValidationApiError(400, "Données invalides", errors, LocalDateTime.now()));
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiError> handleDuplicate(DuplicateResourceException ex) {
        log.warn("Ressource dupliquée: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(new ApiError(409, "Ressource déjà existante", ex.getMessage(), LocalDateTime.now()));
    }

    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleDataIntegrityViolation(
            org.springframework.dao.DataIntegrityViolationException ex) {
        log.error("Erreur d'intégrité des données", ex);
        
        String userMessage = "Une erreur est survenue lors de l'enregistrement des données.";
        
        // Détecter les erreurs courantes et fournir des messages clairs
        if (ex.getMessage().contains("Duplicate entry")) {
            if (ex.getMessage().contains("email")) {
                userMessage = "Cet email est déjà utilisé. Veuillez en choisir un autre.";
            } else {
                userMessage = "Cette information existe déjà dans le système.";
            }
        } else if (ex.getMessage().contains("cannot be null")) {
            userMessage = "Certains champs obligatoires sont manquants.";
        } else if (ex.getMessage().contains("foreign key constraint")) {
            userMessage = "Impossible de supprimer cet élément car il est utilisé ailleurs.";
        }
        
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(new ApiError(409, "Erreur de données", userMessage, LocalDateTime.now()));
    }

    @ExceptionHandler(org.springframework.security.core.AuthenticationException.class)
    public ResponseEntity<ApiError> handleAuthenticationException(
            org.springframework.security.core.AuthenticationException ex) {
        log.warn("Erreur d'authentification: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new ApiError(401, "Authentification requise", 
                "Votre session a expiré ou vos identifiants sont invalides. Veuillez vous reconnecter.", 
                LocalDateTime.now()));
    }

    @ExceptionHandler(io.jsonwebtoken.JwtException.class)
    public ResponseEntity<ApiError> handleJwtException(io.jsonwebtoken.JwtException ex) {
        log.warn("Erreur JWT: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new ApiError(401, "Token invalide", 
                "Votre session a expiré. Veuillez vous reconnecter.", 
                LocalDateTime.now()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneral(Exception ex, WebRequest request) {
        // Log l'erreur complète pour le débogage
        log.error("Erreur inattendue - Type: {}, Message: {}", ex.getClass().getName(), ex.getMessage(), ex);
        
        // Message utilisateur générique mais informatif
        String userMessage = "Une erreur inattendue s'est produite. Veuillez réessayer.";
        
        // Détecter certaines erreurs courantes et fournir des messages plus clairs
        if (ex.getMessage() != null) {
            if (ex.getMessage().contains("Connection refused") || 
                ex.getMessage().contains("Unable to connect")) {
                userMessage = "Impossible de se connecter à la base de données. Veuillez contacter l'administrateur.";
            } else if (ex.getMessage().contains("Timeout")) {
                userMessage = "La requête a pris trop de temps. Veuillez réessayer.";
            } else if (ex.getMessage().contains("JWT")) {
                userMessage = "Erreur d'authentification. Veuillez vous reconnecter.";
            } else if (ex.getMessage().contains("transient")) {
                userMessage = "Erreur de sauvegarde des données. Veuillez réessayer.";
            }
        }
        
        // En mode développement, inclure le message d'erreur technique
        String detailedMessage = userMessage;
        if (ex.getMessage() != null && !ex.getMessage().isEmpty()) {
            detailedMessage = userMessage + " (Détail: " + ex.getMessage() + ")";
        }
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ApiError(500, "Erreur serveur", detailedMessage, LocalDateTime.now()));
    }
}
