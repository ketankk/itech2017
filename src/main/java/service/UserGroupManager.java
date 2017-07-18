package service;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.StandardPasswordEncoder;

import dao.Group;
import dao.UserDetails;
import dao.UserManagementConstant;
import dao.ZDPUserAccess;
import dao.ZDPUserAccessImpl;

public class UserGroupManager {
	private PasswordEncoder passwordEncoder = new StandardPasswordEncoder("ThisIsASecretSoChangeMe");

	public ResponseEntity<Object> checkGroupAvailability(String groupName) throws Exception {
		ResponseEntity<Object> responseEntity;
		ZDPUserAccess zdpUserAccess = new ZDPUserAccessImpl();
		boolean isAvailable = zdpUserAccess.isGroupNameAvailable(groupName);
		responseEntity = new ResponseEntity<Object>(isAvailable, HttpStatus.OK);
		return responseEntity;
	}

	public ResponseEntity<Object> createGroup(Group group, HttpServletRequest httpServletRequest) throws Exception {
		ResponseEntity<Object> responseEntity;
		ZDPUserAccess zdpUserAccess = new ZDPUserAccessImpl();
		String createdBy = null;
		CommonUtils commonUtils = new CommonUtils();
		createdBy = commonUtils.extractUserNameFromRequest(httpServletRequest);
		try {
			Boolean isCreated = zdpUserAccess.createGroup(group.getGroupName(), group.getDescription(), createdBy);
			responseEntity = new ResponseEntity<Object>(isCreated, HttpStatus.OK);
		} catch (Exception superUserException) {
			responseEntity = new ResponseEntity<Object>(superUserException.getMessage(), HttpStatus.FORBIDDEN);
		}
		return responseEntity;
	}

	public ResponseEntity<Object> addUser(UserDetails userDetails, HttpServletRequest httpServletRequest) {
		ResponseEntity<Object> responseEntity;
		ZDPUserAccess zdpUserAccess = new ZDPUserAccessImpl();
		String userName = null;
		CommonUtils commonUtils = new CommonUtils();
		userName = commonUtils.extractUserNameFromRequest(httpServletRequest);
		userDetails.setPassword(passwordEncoder.encode(UserManagementConstant.DEFAULT_PASSWORD));
		try {
			Boolean isAdded = zdpUserAccess.addUser(userName, userDetails);
			responseEntity = new ResponseEntity<Object>(isAdded, HttpStatus.OK);
		} catch (Exception exception) {
			responseEntity = new ResponseEntity<Object>(exception.getMessage(), HttpStatus.FORBIDDEN);
		}
		return responseEntity;
	}

	public ResponseEntity<Object> updateUser(UserDetails userDetails, HttpServletRequest httpServletRequest) {
		ResponseEntity<Object> responseEntity;
		ZDPUserAccess zdpUserAccess = new ZDPUserAccessImpl();
		String userName = null;
		CommonUtils commonUtils = new CommonUtils();
		userName = commonUtils.extractUserNameFromRequest(httpServletRequest);
		try {
			Boolean isUpdated = zdpUserAccess.updateUser(userName, userDetails);
			responseEntity = new ResponseEntity<Object>(isUpdated, HttpStatus.OK);
		} catch (Exception superUserException) {
			responseEntity = new ResponseEntity<Object>(superUserException.getMessage(), HttpStatus.FORBIDDEN);
		}
		return responseEntity;
	}

	public ResponseEntity<Object> listUser(HttpServletRequest httpServletRequest) throws Exception {
		ResponseEntity<Object> responseEntity;
		ZDPUserAccess zdpUserAccess = new ZDPUserAccessImpl();
		List<UserDetails> userList = null;
		String userName = null;
		CommonUtils commonUtils = new CommonUtils();
		userName = commonUtils.extractUserNameFromRequest(httpServletRequest);
		try {
			userList = zdpUserAccess.getUserList(userName);
			responseEntity = new ResponseEntity<Object>(userList, HttpStatus.OK);
		} catch (Exception superUserException) {
			responseEntity = new ResponseEntity<Object>(superUserException.getMessage(), HttpStatus.FORBIDDEN);
		}
		return responseEntity;
	}

	public ResponseEntity<Object> getUser(String userId, HttpServletRequest httpServletRequest) throws Exception {
		ResponseEntity<Object> responseEntity;
		ZDPUserAccess zdpUserAccess = new ZDPUserAccessImpl();
		UserDetails userDetails = null;
		String callerName = null;
		CommonUtils commonUtils = new CommonUtils();
		callerName = commonUtils.extractUserNameFromRequest(httpServletRequest);
		try {
			userDetails = zdpUserAccess.getUser(callerName, userId);
			responseEntity = new ResponseEntity<Object>(userDetails, HttpStatus.OK);
		} catch (Exception superUserException) {
			responseEntity = new ResponseEntity<Object>(superUserException.getMessage(), HttpStatus.FORBIDDEN);
		}
		return responseEntity;
	}

	public ResponseEntity<Object> getGroup(String groupName, HttpServletRequest httpServletRequest) throws Exception {
		ResponseEntity<Object> responseEntity;
		ZDPUserAccess zdpUserAccess = new ZDPUserAccessImpl();
		Group group = null;
		String callerName = null;
		CommonUtils commonUtils = new CommonUtils();
		callerName = commonUtils.extractUserNameFromRequest(httpServletRequest);
		try {
			group = zdpUserAccess.getGroup(callerName, groupName);
			responseEntity = new ResponseEntity<Object>(group, HttpStatus.OK);
		} catch (Exception superUserException) {
			responseEntity = new ResponseEntity<Object>(superUserException.getMessage(), HttpStatus.FORBIDDEN);
		}
		return responseEntity;
	}

	public ResponseEntity<Object> enableOrDisableUserAccount(Boolean tobeEnabled, String userId,
			HttpServletRequest httpServletRequest) throws Exception {
		ResponseEntity<Object> responseEntity;
		ZDPUserAccess zdpUserAccess = new ZDPUserAccessImpl();
		String callerName = null;
		CommonUtils commonUtils = new CommonUtils();
		callerName = commonUtils.extractUserNameFromRequest(httpServletRequest);
		Boolean accountUpdateStatus = false;
		try {
			accountUpdateStatus = zdpUserAccess.updateAccountStatus(tobeEnabled, userId, callerName);
		} catch (Exception superUserException) {
			responseEntity = new ResponseEntity<Object>(superUserException.getMessage(), HttpStatus.FORBIDDEN);
		}
		responseEntity = new ResponseEntity<Object>(accountUpdateStatus, HttpStatus.OK);
		return responseEntity;
	}

}
