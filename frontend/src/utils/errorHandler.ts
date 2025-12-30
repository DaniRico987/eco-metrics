import { ApolloError } from "@apollo/client";

/**
 * Convierte errores técnicos de Apollo/GraphQL en mensajes amigables para el usuario
 */
export const getReadableErrorMessage = (error: ApolloError | Error): string => {
  // Si es un ApolloError, revisa los errores de GraphQL
  if (error instanceof ApolloError) {
    // Revisa si hay errores de GraphQL con mensajes específicos
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      const graphQLError = error.graphQLErrors[0];
      const message = graphQLError.message;

      // Mapea mensajes del backend a mensajes amigables
      if (message.includes("Invalid credentials")) {
        return "Credenciales incorrectas. Verifica tu correo y contraseña.";
      }
      if (message.includes("Email already in use")) {
        return "Este correo ya está registrado. Intenta iniciar sesión.";
      }
      if (message.includes("access request has been rejected")) {
        return "Tu solicitud de acceso fue rechazada por el administrador.";
      }
      if (message.includes("User not found")) {
        return "Usuario no encontrado.";
      }
      if (message.includes("Unauthorized")) {
        return "No tienes autorización para realizar esta acción.";
      }
      if (message.includes("Forbidden")) {
        return "Acceso denegado.";
      }
      if (
        message.includes("already exists") ||
        message.includes("Unique constraint")
      ) {
        return "Este registro ya existe. Por favor, verifica los datos.";
      }
      if (message.includes("Not found")) {
        return "El recurso solicitado no fue encontrado.";
      }
      if (message.includes("Validation")) {
        return "Los datos ingresados no son válidos. Verifica e intenta de nuevo.";
      }
      if (message.includes("Network")) {
        return "Error de conexión. Verifica tu red e intenta de nuevo.";
      }
      if (message.includes("Internal server error")) {
        return "Error del servidor. Por favor, intenta más tarde.";
      }

      // Si no hay un mapeo específico, devuelve el mensaje original del backend
      return message;
    }

    // Errores de red
    if (error.networkError) {
      return "No se pudo conectar con el servidor. Verifica tu conexión.";
    }

    // Error genérico de Apollo
    return "Ocurrió un error inesperado. Por favor, intenta de nuevo.";
  }

  // Si es un error genérico de JavaScript
  return error.message || "Ocurrió un error inesperado.";
};
