package com.itc.itech.usermanagement;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import dao.Group;
import dao.UserDetails;
import service.UserGroupManager;

@RestController
@RequestMapping("/rest/service/usergroup")
public class UserGroupController {
	@RequestMapping(value = "/checkgroupnameavailability/{groupname}", method = RequestMethod.GET, headers = "Accept=application/json")
	public @ResponseBody
	ResponseEntity<Object> checkGroupNameAvailability(
			@PathVariable("groupname") String groupName) {
		UserGroupManager userGroupManager = new UserGroupManager();
		try {
			return userGroupManager.checkGroupAvailability(groupName);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	@RequestMapping(value = "/creategroup", method = RequestMethod.POST, headers = "Accept=application/json")
	public ResponseEntity<Object> createGroup(@RequestBody Group group,
			HttpServletRequest httpServletRequest) {
		UserGroupManager userGroupManager = new UserGroupManager();
		try {
			return userGroupManager.createGroup(group, httpServletRequest);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	@RequestMapping(value = "/getGroup/{grpname}", method = RequestMethod.GET, headers = "Accept=application/json")
	public ResponseEntity<Object> getGroupByName(
			@PathVariable("grpname") String groupName,
			HttpServletRequest httpServletRequest) {
		UserGroupManager userGroupManager = new UserGroupManager();
		try {
			return userGroupManager.getGroup(groupName, httpServletRequest);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	/*@RequestMapping(value = "/updategroup", method = RequestMethod.POST, headers = "Accept=application/json")
	public ResponseEntity<Object> updateGroup(@RequestBody Group group,
			HttpServletRequest httpServletRequest) {
		UserGroupManager userGroupManager = new UserGroupManager();
		try {
			return userGroupManager.updateGroup(group, httpServletRequest);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	@RequestMapping(value = "/deletegroup/{groupname}", method = RequestMethod.DELETE, headers = "Accept=application/json")
	public ResponseEntity<Object> deleteGroup(
			@PathVariable("groupname") String groupName,
			HttpServletRequest httpServletRequest) {
		UserGroupManager userGroupManager = new UserGroupManager();
		try {
			return userGroupManager.deleteGroup(groupName, httpServletRequest);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	@RequestMapping(value = "/listGroup", method = RequestMethod.GET, headers = "Accept=application/json")
	public @ResponseBody
	ResponseEntity<Object> getGroupList(HttpServletRequest httpServletRequest) {
		UserGroupManager userGroupManager = new UserGroupManager();
		try {
			return userGroupManager.listGroup(httpServletRequest);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}*/

	@RequestMapping(value = "/addUser", method = RequestMethod.POST, headers = "Accept=application/json")
	public @ResponseBody
	ResponseEntity<Object> addUser(@RequestBody UserDetails userDetails,
			HttpServletRequest httpServletRequest) {
		UserGroupManager userGroupManager = new UserGroupManager();
		return userGroupManager.addUser(userDetails, httpServletRequest);
	}

	@RequestMapping(value = "/updateUser", method = RequestMethod.POST, headers = "Accept=application/json")
	public @ResponseBody
	ResponseEntity<Object> updateUser(@RequestBody UserDetails userDetails,
			HttpServletRequest httpServletRequest) {
		UserGroupManager userGroupManager = new UserGroupManager();
		return userGroupManager.updateUser(userDetails, httpServletRequest);
	}

	@RequestMapping(value = "/listUsers", method = RequestMethod.GET, headers = "Accept=application/json")
	public ResponseEntity<Object> getUsers(HttpServletRequest httpServletRequest) {
		UserGroupManager userGroupManager = new UserGroupManager();
		try {
			return userGroupManager.listUser(httpServletRequest);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	@RequestMapping(value = "/getUser/{userId}", method = RequestMethod.GET, headers = "Accept=application/json")
	public ResponseEntity<Object> getUserById(
			@PathVariable("userId") String userId,
			HttpServletRequest httpServletRequest) {
		UserGroupManager userGroupManager = new UserGroupManager();
		try {
			return userGroupManager.getUser(userId, httpServletRequest);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	@RequestMapping(value = "/enableUserAccount/{userId}", method = RequestMethod.GET, headers = "Accept=application/json")
	public ResponseEntity<Object> enableUserAccount(
			@PathVariable("userId") String userId,
			HttpServletRequest httpServletRequest) {
		UserGroupManager userGroupManager = new UserGroupManager();
		try {
			return userGroupManager.enableOrDisableUserAccount(true, userId,
					httpServletRequest);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	@RequestMapping(value = "/disableUserAccount/{userId}", method = RequestMethod.GET, headers = "Accept=application/json")
	public ResponseEntity<Object> disableUserAccount(
			@PathVariable("userId") String userId,
			HttpServletRequest httpServletRequest) {
		UserGroupManager userGroupManager = new UserGroupManager();
		try {
			return userGroupManager.enableOrDisableUserAccount(false, userId,
					httpServletRequest);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

}
