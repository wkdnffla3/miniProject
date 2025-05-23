package org.example.backproject.controller;

import java.io.IOException;
import org.example.backproject.security.JwtUtil;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String jwt = jwtUtil.createToken(email);
        
        String redirectUrl = "http://localhost:5173/?token=" + jwt;
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);

        

        response.setContentType("application/json");
        response.getWriter().write("{\"token\": \"" + jwt + "\"}");
        response.getWriter().flush();
    }
}
