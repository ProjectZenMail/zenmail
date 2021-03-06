package org.zen.zenmail.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.*;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.access.channel.ChannelProcessingFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.zen.zenmail.identity.*;
import org.springframework.core.annotation.Order;


@Configuration
@EnableWebSecurity
@ComponentScan("org.zen.zenmail.identity")
@Order(1)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private TokenUtil tokenUtil;

    @Autowired
    private TokenAuthenticationManager tokenAuthenticationManager;

    @Override
    public void configure(WebSecurity web) throws Exception {
        // Filters will not get executed for the resources
        web.ignoring().antMatchers("/", "/resources/**", "/static/**", "/public/**", "/webui/**"//, "/h2-console/**"
                , "/configuration/**", "/swagger-ui/**", "/swagger-resources/**", "/api-docs", "/api-docs/**", "/v2/api-docs/**"
                , "/*.html", "/**/*.html", "/**/*.css", "/user", "/**/*.js", "/**/*.png", "/**/*.jpg", "/**/*.gif", "/**/*.svg", "/**/*.ico", "/**/*.ttf", "/**/*.woff");


    }

    //If Security is not working check application.properties if it is set to ignore
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .exceptionHandling().and()
                .anonymous().and()
                .authorizeRequests().antMatchers("/").permitAll()
                .and().authorizeRequests().antMatchers("console/**", "h2-console/**").permitAll().and()
                // Disable Cross site references
                .csrf().disable().headers().frameOptions().disable().and()
                // Add CORS Filter
                .addFilterBefore(new CorsFilter(), ChannelProcessingFilter.class)
                // Custom Token based authentication based on the header previously given to the client
                .addFilterBefore(new VerifyTokenFilter(tokenUtil), UsernamePasswordAuthenticationFilter.class)
                // custom JSON based authentication by POST of {"username":"<name>","password":"<password>"} which sets the token header upon authentication
                .addFilterBefore(new GenerateTokenForUserFilter("/session", tokenAuthenticationManager, tokenUtil), UsernamePasswordAuthenticationFilter.class)
        //.authorizeRequests()

        //.anyRequest().authenticated()
        ;
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.
                eraseCredentials(false);
        super.configure(auth);
    }
}
