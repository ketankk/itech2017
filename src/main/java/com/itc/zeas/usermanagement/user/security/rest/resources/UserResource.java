package com.itc.zeas.usermanagement.user.security.rest.resources;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.itc.zeas.usermanagement.user.security.rest.TokenUtils;
import com.itc.zeas.usermanagement.user.security.transfer.TokenTransfer;
import com.itc.zeas.usermanagement.user.security.transfer.UserTransfer;

import dao.UserService;
import service.AuthenticationLogManager;
import service.LoginEvent;

@RestController
@RequestMapping("/rest/user")
public class UserResource {

	@Autowired
	private UserDetailsService userService;

	@Autowired
	@Qualifier("authenticationManager")
	private AuthenticationManager authManager;
	
	@Autowired
	private AuthenticationLogManager authLogManager;

	public void setAuthLogManager(AuthenticationLogManager authLogManager) {
		this.authLogManager = authLogManager;
	}

	/**
	 * Retrieves the currently logged in user.
	 * 
	 * @return A transfer containing the username and the roles.
	 */
	// @GET
	// @Produces(MediaType.APPLICATION_JSON)
	@RequestMapping(method = RequestMethod.GET, headers = "Accept=application/json")
	public UserTransfer getUser() {
		Authentication authentication = SecurityContextHolder.getContext()
				.getAuthentication();
		Object principal = authentication.getPrincipal();
		System.out.println("inside getUser method ==" + principal);
		if (principal instanceof String
				&& ((String) principal).equals("anonymousUser")) {
			return new UserTransfer("anonymousUser",
					new HashMap<String, Boolean>());
		}
		UserDetails userDetails = (UserDetails) principal;

		return new UserTransfer(userDetails.getUsername(),
				this.createRoleMap(userDetails));
	}

	/**
	 * Authenticates a user and creates an authentication token.
	 * 
	 * @param userName
	 *            The name of the user.
	 * @param password
	 *            The password of the user.
	 * @return A transfer containing the authentication token.
	 * @throws Exception 
	 */

	@RequestMapping(value = "/authenticate", method = RequestMethod.POST, headers = "Accept=application/json")
	public TokenTransfer authenticate(
			@RequestParam("username") String userName,
			@RequestParam("password") String password,
			HttpServletRequest request) throws Exception {
		
		System.out.println("authenticate ===" + userName + "000" + password);
//		AuthenticationLogManager authLogManager = new AuthenticationLogManager();
		UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
				userName, password);
		try {
			Authentication authentication = this.authManager.authenticate(authenticationToken);
			SecurityContextHolder.getContext().setAuthentication(authentication);
			authLogManager.logLoginEvent(userName, LoginEvent.VALIDLOGIN, request);
		} catch (BadCredentialsException bce) {
			authLogManager.logLoginEvent(userName, LoginEvent.INVALIDLOGIN, request);
			throw bce;
		} catch (DisabledException exception) {
			/** BugID: 85 */
			authLogManager.logLoginEvent(userName, LoginEvent.INVALIDLOGIN, request);
			throw exception;
		}

		/*
		 * Reload user as password of authentication principal will be null
		 * after authorization and password is needed for token generation
		 */
		UserDetails userDetails = this.userService.loadUserByUsername(userName);

		return new TokenTransfer(TokenUtils.createToken(userDetails));
	}

	private Map<String, Boolean> createRoleMap(UserDetails userDetails) {
		Map<String, Boolean> roles = new HashMap<String, Boolean>();
		for (GrantedAuthority authority : userDetails.getAuthorities()) {
			roles.put(authority.getAuthority(), Boolean.TRUE);
		}

		return roles;
	}

	@RequestMapping(value = "/forgetPassword/{userName}", method = RequestMethod.POST, headers = "Accept=application/json")
	public @ResponseBody
	void forgetPassword(@PathVariable("userName") String UserName) throws SQLException {
		UserService userService = new UserService();
		try {
			userService.forgetPassword(UserName);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}