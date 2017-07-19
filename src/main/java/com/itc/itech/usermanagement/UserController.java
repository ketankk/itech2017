package com.itc.zeas.usermanagement;

import java.sql.SQLException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.StandardPasswordEncoder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import dao.UserDetails;
import dao.UserService;
import service.AuthenticationLogManager;
import service.CommonUtils;
import service.LoginEvent;

/**
 * @author 16765
 * 
 */
@RestController
@RequestMapping("/rest/service")
public class UserController {
	private PasswordEncoder passwordEncoder = new StandardPasswordEncoder(
			"ThisIsASecretSoChangeMe");
	boolean resetpassword = false;

	@RequestMapping(value = "/listUsers", method = RequestMethod.GET, headers = "Accept=application/json")
	public List<UserDetails> getUsers() throws SQLException {
		UserService userService = new UserService();
		List<UserDetails> users = null;
		try {
			users = userService.getUsers();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return users;

	}

	@RequestMapping(value = "/addUser", method = RequestMethod.POST, headers = "Accept=application/json")
	public @ResponseBody
	UserDetails addUsers(@RequestBody UserDetails userDetails) throws SQLException {
		UserService userService = new UserService();
		try {
			userService.addUsers(userDetails);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return userDetails;
	}

	@RequestMapping(value = "/updateUser/{userId}", method = RequestMethod.POST, headers = "Accept=application/json")
	public @ResponseBody
	UserDetails updateUser(@RequestBody UserDetails userDetails,
			@PathVariable("userId") Integer userId) throws SQLException {
		UserService userService = new UserService();
		try {
			userService.updateUsers(userDetails, userId);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return userDetails;
	}

	@RequestMapping(value = "/deleteUser/{userId}", method = RequestMethod.DELETE, headers = "Accept=application/json")
	public @ResponseBody
	void deleteUser(@PathVariable("userId") Integer userId) throws SQLException {
		UserService userService = new UserService();
		try {
			userService.deleteUsers(userId);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@RequestMapping(value = "/getUser/{userId}", method = RequestMethod.GET, headers = "Accept=application/json")
	public @ResponseBody
	UserDetails getUserById(@PathVariable("userId") Integer userId) throws SQLException {
		UserService userService = new UserService();
		UserDetails dtl = null;
		try {
			dtl = userService.getUserById(userId);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return dtl;

	}

	@RequestMapping(value = "/updatePassword/{userName}", method = RequestMethod.POST, headers = "Accept=application/json")
	public @ResponseBody
	UserDetails updatePassword(@RequestBody UserDetails userDetails,
			@PathVariable("userName") String UserName) throws SQLException {
		UserService userService = new UserService();
		String userDbPassword;
		try {
			userDbPassword = userService.getUserPassword(UserName);
			CharSequence rawPassword = userDetails.getPassword();

			if ((passwordEncoder.matches(rawPassword, userDbPassword))) {
				userService.updatePassword(userDetails, UserName);
				resetpassword = true;
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return userDetails;
	}

	@RequestMapping(value = "/CheckUserNameAvailability/{userName}", method = RequestMethod.POST, headers = "Accept=application/json")
	public @ResponseBody
	boolean CheckUserNameAvailability(@PathVariable("userName") String UserName) throws SQLException {
		UserService userService = new UserService();
		boolean exists = false;
		try {
			exists = userService.checkAvailability(UserName);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return exists;
	}

	@RequestMapping(value = "/logout/{userName}", method = RequestMethod.POST, headers = "Accept=application/json")
	public @ResponseBody
	void logout(@PathVariable("userName") String UserName,
			HttpServletRequest request) throws SQLException {
		AuthenticationLogManager authLogManager = new AuthenticationLogManager();
		CommonUtils commonUtils = new CommonUtils();
		String accessToken = commonUtils.extractAuthTokenFromRequest(request);
		String userName = commonUtils.getUserNameFromToken(accessToken);
		try {
			authLogManager.logLoginEvent(userName, LoginEvent.LOGOUT, request);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		System.out.println("logout successfully..........");
		//DBUtility.closeMysqlConnection();
		//com.taphius.databridge.utility.DBUtility.closeMysqlConnection();
		System.out.println("close db connection");
	}
}
