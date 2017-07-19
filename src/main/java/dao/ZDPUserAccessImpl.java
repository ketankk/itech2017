package dao;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.log4j.Logger;

/**
 * contains a set of service implementation to provide authorization support
 * 
 * @author 19217
 * 
 */
public class ZDPUserAccessImpl implements ZDPUserAccess {
	// Connection connection;
	private static final Logger LOGGER = Logger.getLogger(ZDPUserAccessImpl.class);

	@Override
	public Integer validateAndReturnMaxPermission(UserManagementConstant.ResourceType resourceType, String userName,
			Long resourceId, Integer permission) throws Exception {
		int maxPermission = getPermissionForGivenResource(resourceType, resourceId, userName);
		int permissionToCompare = maxPermission & permission;
		if (permissionToCompare == permission) {
			LOGGER.info("user: " + userName + " have requested permission: " + permission + " for the resource of type:"
					+ resourceType + " with id: " + resourceId);
			return maxPermission;
		} else {
			String erormessage = "user: " + userName + " doesn't have requested permission: " + permission
					+ " for the resource of type:" + resourceType + " with id: " + resourceId;
			LOGGER.info(erormessage);
			throw new Exception(erormessage);
		}
	}

	@Override
	public Boolean validateUserPermissionForResource(UserManagementConstant.ResourceType resourceType, String userName,
			Long resourceId, Integer permission) throws Exception {
		Boolean haveValidPermission = false;

		int maxPermission = getPermissionForGivenResource(resourceType, resourceId, userName);
		maxPermission = maxPermission & permission;
		if (maxPermission == permission) {
			haveValidPermission = true;
			LOGGER.info("user: " + userName + " have requested permission: " + permission + " for the resource of type:"
					+ resourceType + " with id: " + resourceId);
		} else {
			LOGGER.info("user: " + userName + " doesn't have requested permission: " + permission
					+ " for the resource of type:" + resourceType + " with id: " + resourceId);
		}
		return haveValidPermission;
	}

	@Override
	public void logEventPerfomedOnResources(UserManagementConstant.ResourceType resourceType, Long resourceId,
			String eventType, String userName, String sharedWithGroup, String description) throws Exception {
		String sQuery;
		Connection connection = null;
		PreparedStatement preparedStatement = null;

		try {
			if (resourceType.equals(UserManagementConstant.ResourceType.DATASET)) {
				LOGGER.debug("resource type is: " + resourceType);
				sQuery = ConnectionUtility.getSQlProperty("INSERT_INTO_DATASETEVENT");
			} else if (resourceType.equals(UserManagementConstant.ResourceType.PROJECT)) {
				LOGGER.debug("resource type is: " + resourceType);
				sQuery = ConnectionUtility.getSQlProperty("INSERT_INTO_PROJECTEVENT");
			} else {
				LOGGER.info("invalid resource type: " + resourceType);
				// TODO should through exception
				return;
			}
			connection = ConnectionUtility.getConnection();
			preparedStatement = connection.prepareStatement(sQuery);
			preparedStatement.setLong(1, resourceId);
			preparedStatement.setString(2, eventType);
			preparedStatement.setString(3, userName);
			preparedStatement.setString(4, sharedWithGroup);
			preparedStatement.setString(5, description);
			preparedStatement.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			ConnectionUtility.releaseConnectionResources(preparedStatement, connection);
		}
	}

	public String getProjectCreator(Long projectId) throws Exception {
		String projectCreator = null;
		Connection connection = null;
		ResultSet resultSet = null;
		PreparedStatement preparedStatement = null;
		try {
			connection = ConnectionUtility.getConnection();
			String projCreatorQuery = ConnectionUtility.getSQlProperty("GET_PROJECT_CREATOR");
			preparedStatement = connection.prepareStatement(projCreatorQuery);
			preparedStatement.setLong(1, projectId);
			resultSet = preparedStatement.executeQuery();
			if (resultSet.next()) {
				projectCreator = resultSet.getString(1);
			}
		} catch (SQLException e) {
			LOGGER.error("SQLException while executing sql query string GET_PROJECT_CREATOR");
			e.printStackTrace();
		} finally {
			ConnectionUtility.releaseConnectionResources(resultSet, preparedStatement, connection);
		}
		return projectCreator;
	}

	public String getEntityCreator(String entityName) throws Exception {
		String userName = null;
		Connection connection = null;
		PreparedStatement preparedStatement = null;
		ResultSet rs = null;
		try {
			connection = ConnectionUtility.getConnection();
			String sQuery = ConnectionUtility.getSQlProperty("SELECT_ENTITY_BY_NAME");
			preparedStatement = connection.prepareStatement(sQuery);
			preparedStatement.setString(1, entityName);
			rs = preparedStatement.executeQuery();
			if (rs.next()) {
				userName = rs.getString("createdBy");
			}
		} catch (SQLException sqlException) {
			LOGGER.error("SQLException while executing sql query string SELECT_ENTITY_BY_NAME");
			sqlException.printStackTrace();
		} finally {
			if (rs != null) {
				try {
					rs.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
			if (preparedStatement != null) {
				try {
					preparedStatement.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
			if (connection != null) {
				try {
					connection.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
		return userName;
	}

	public Boolean canDeleteDatset(String entityName, String userName) throws Exception {
		// only owner/grp admin/superuser can delete a resource
		if (isSuperUser(userName)) {
			return true;
		}
		Boolean canDelete = false;
		String entityCreator = getEntityCreator(entityName);
		if (userName.equals(entityCreator)) {
			canDelete = true;
		}
		return canDelete;
	}

	public Boolean canDeleteProject(Long projectId, String userName) throws Exception {
		// only owner/grp admin/superuser can delete a resource
		if (isSuperUser(userName)) {
			return true;
		}
		Boolean canDelete = false;
		String projectCreator = getProjectCreator(projectId);
		if (userName.equals(projectCreator)) {
			canDelete = true;
		}
		return canDelete;
	}

	@Override
	public Boolean isSuperUser(String userName) throws Exception {
		Boolean isSuperUser = false;
		Connection connection = null;
		String sqlQuery = null;
		ResultSet resultSet = null;
		PreparedStatement preparedStatement = null;
		try {
			connection = ConnectionUtility.getConnection();
			sqlQuery = ConnectionUtility.getSQlProperty("IS_SUPER_USER");
			// IS_SUPER_USER=Select * from group_membership where User_id=? And
			// group_id='admin';
			preparedStatement = connection.prepareStatement(sqlQuery);
			preparedStatement.setString(1, userName);
			resultSet = preparedStatement.executeQuery();
			if (resultSet.next()) {
				isSuperUser = true;
			}
		} catch (SQLException e) {
			LOGGER.error("SQLException while executing sql query string IS_SUPER_USER");
			e.printStackTrace();
		} finally {
			ConnectionUtility.releaseConnectionResources(resultSet, preparedStatement, connection);
		}
		return isSuperUser;
	}

	@Override
	public Boolean createGroup(String groupName, String description, String createdBy) throws Exception {
		// check for super user - only super user can create group
		if (!isSuperUser(createdBy)) {
			throw new Exception("for creating group you need to be super user");
		}
		Boolean isCreated = false;
		Connection connection = null;
		String sqlQuery = null;
		PreparedStatement preparedStatement = null;
		try {
			connection = ConnectionUtility.getConnection();
			sqlQuery = ConnectionUtility.getSQlProperty("ADD_GROUP");
			// ADD_GROUP=insert into groups
			// (id,description,created,createdBy,is_singleuser,superuser_group)
			// values (?,?,now(),?,0,0)
			preparedStatement = connection.prepareStatement(sqlQuery);
			preparedStatement.setString(1, groupName);
			preparedStatement.setString(2, description);
			preparedStatement.setString(3, createdBy);
			preparedStatement.executeUpdate();
			isCreated = true;
		} catch (SQLException e) {
			LOGGER.error("SQLException while executing sql query string ADD_GROUP");
			e.printStackTrace();
		} finally {
			if (preparedStatement != null) {
				try {
					preparedStatement.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
			if (connection != null) {
				try {
					connection.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
		return isCreated;
	}

	@Override
	public Boolean updateGroup(String groupName, String description, String callerName) throws Exception {
		// check for super user - only super user can update group
		if (!isSuperUser(callerName)) {
			throw new Exception("for updating a group you need to be super user");
		}
		Boolean isUpdated = false;
		Connection connection = null;
		String sqlQuery = null;
		PreparedStatement preparedStatement = null;
		try {
			connection = ConnectionUtility.getConnection();
			sqlQuery = ConnectionUtility.getSQlProperty("UPDATE_GROUP");
			// UPDATE_GROUP=update groups set description=? where id=?;
			preparedStatement = connection.prepareStatement(sqlQuery);
			preparedStatement.setString(1, description);
			preparedStatement.setString(2, groupName);
			preparedStatement.executeUpdate();
			isUpdated = true;
		} catch (SQLException e) {
			LOGGER.error("SQLException while executing sql query string UPDATE_GROUP");
			e.printStackTrace();
		} finally {
			ConnectionUtility.releaseConnectionResources(preparedStatement, connection);
		}
		return isUpdated;
	}

	@Override
	public Boolean deleteGroup(String groupName, String userName) throws Exception {
		// check for super user - only super user can delete group
		if (!isSuperUser(userName)) {
			throw new Exception("for deleting a group you need to be super user");
		}
		Boolean isDeleted = false;
		Connection connection = null;
		String sqlQuery = null;
		PreparedStatement preparedStatement = null;
		try {
			connection = ConnectionUtility.getConnection();
			sqlQuery = ConnectionUtility.getSQlProperty("DELETE_GROUP");
			// ADD_GROUP=insert into groups
			// (id,description,created,createdBy,is_singleuser,superuser_group)
			// values (?,?,now(),?,0,0)
			preparedStatement = connection.prepareStatement(sqlQuery);
			preparedStatement.setString(1, groupName);
			preparedStatement.executeUpdate();
			isDeleted = true;
		} catch (SQLException e) {
			LOGGER.error("SQLException while executing sql query string DELETE_GROUP");
			e.printStackTrace();
		} finally {
			if (preparedStatement != null) {
				try {
					preparedStatement.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
			if (connection != null) {
				try {
					connection.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
		return isDeleted;
	}

	@Override
	public Boolean isGroupNameAvailable(String groupName) throws Exception {
		boolean isAvailable = false;
		Connection connection = null;
		String sqlQuery = null;
		ResultSet rs = null;
		PreparedStatement preparedStatement = null;
		try {
			connection = ConnectionUtility.getConnection();
			sqlQuery = ConnectionUtility.getSQlProperty("CHECK_GROUP_AVAILABILITY");
			preparedStatement = connection.prepareStatement(sqlQuery);
			preparedStatement.setString(1, groupName);
			rs = preparedStatement.executeQuery();
			if (rs.next()) {
				isAvailable = true;
			}
		} catch (SQLException e) {
			LOGGER.error("SQLException while executing sql query string CHECK_USER_AVAILABILITY");
			e.printStackTrace();
		} finally {
			ConnectionUtility.releaseConnectionResources(rs, preparedStatement, connection);
		}
		return isAvailable;
	}

	@Override
	public List<Group> getGroupList(String userName) throws Exception {
		// check for super user - only super user can create group
		if (!isSuperUser(userName)) {
			throw new Exception("not allowed to view group list");
		}
		List<Group> groupList = new ArrayList<Group>();
		Connection connection = null;
		String sqlQuery = null;
		ResultSet rs = null;
		PreparedStatement preparedStatement = null;
		try {
			connection = ConnectionUtility.getConnection();
			sqlQuery = ConnectionUtility.getSQlProperty("LIST_GROUP");
			// LIST_GROUP = select * from groups
			preparedStatement = connection.prepareStatement(sqlQuery);
			rs = preparedStatement.executeQuery();
			while (rs.next()) {
				Group group = new Group();
				group.setGroupName(rs.getString("id"));
				group.setDescription(rs.getString("description"));
				group.setIsSuperGroup(rs.getBoolean("superuser_group"));
				group.setIsdisabled(rs.getBoolean("isDisabled"));
				groupList.add(group);
			}
		} catch (SQLException e) {
			LOGGER.error("SQLException while executing sql query string LIST_GROUP");
			e.printStackTrace();
		} finally {
			ConnectionUtility.releaseConnectionResources(rs, preparedStatement, connection);
		}
		return groupList;
	}

	@Override
	public Boolean addUser(String userName, UserDetails userDetails) throws Exception {
		// // check for super user - only super user can create group
		String role = UserManagementConstant.USER_ROLE;
		Long userId;
		Boolean isSuperUser = isSuperUser(userName);
		if (!isSuperUser) {
			throw new Exception("not allowed to view group list");
		}
		Boolean isAddedOrUpdated = false;
		Boolean isUserTobeAddedIsSuperUser = isUserTobeAddedOrUpdatedIsSuperUser(userDetails);
		Connection connection = null;
		String sqlQuery = null;
		PreparedStatement preparedStatement = null;
		PreparedStatement preparedStatement1 = null;
		PreparedStatement preparedStatement2 = null;
		ResultSet rs = null;
		try {
			connection = ConnectionUtility.getConnection();
			sqlQuery = ConnectionUtility.getSQlProperty("ADD_USERDETAILS_IN_USER_TABLE");
			// Set auto commit as false.
			connection.setAutoCommit(false);
			preparedStatement = connection.prepareStatement(sqlQuery, Statement.RETURN_GENERATED_KEYS);
			preparedStatement.setString(1, userDetails.getUserName());
			preparedStatement.setString(2, userDetails.getPassword());
			preparedStatement.setString(3, userDetails.getEmail());
			// get name will give first name + last name
			preparedStatement.setString(4, userDetails.getName());
			preparedStatement.setString(5, userName);
			preparedStatement.setString(6, userName);
			String dateOfBirth = userDetails.getDateOfBirth();
			// DEFAULT_DOB_TIMESTAMP will be used if dob is empty or null
			Long dobTimestamp = UserManagementConstant.DEFAULT_DOB_TIMESTAMP;
			// to handle scenario where request json doesn't include DOB field
			// or it is just a empty string
			if (!(dateOfBirth == null || dateOfBirth.equals(""))) {
				dobTimestamp = Long.parseLong(userDetails.getDateOfBirth());
			}
			preparedStatement.setDate(7, new Date(dobTimestamp));
			Long contactNumber = userDetails.getContactNumber();
			if (contactNumber == null || (contactNumber == 0)) {

				// if contact number is null we are considering default contact
				// number
				contactNumber = UserManagementConstant.DEFAULT_CONTACT_NUMBER;
			} else {
				String contactNumberString = contactNumber.toString();
				// if the contact no size is more than
				// 'UserManagementConstant.SIZE_OF_CONTACT_NUMBER' then we
				// discarding additional digit
				if (contactNumberString.length() > UserManagementConstant.SIZE_OF_CONTACT_NUMBER) {
					contactNumber = Long
							.parseLong(contactNumberString.substring(0, UserManagementConstant.SIZE_OF_CONTACT_NUMBER));
				}
			}
			preparedStatement.setLong(8, contactNumber);
			String gender = userDetails.getGender();
			if (gender == null || gender.equals("")) {
				gender = UserManagementConstant.DEFAULT_GENDER;
			}
			preparedStatement.setString(9, gender);
			String address = userDetails.getAddress();
			if (address == null || address.equals("")) {
				address = UserManagementConstant.DEFAULT_ADDRESS;
			}
			preparedStatement.setString(10, address);
			if (userDetails.getHaveWritePermissionOnDataset() || isUserTobeAddedIsSuperUser) {
				preparedStatement.setInt(11, 1);
			} else {
				preparedStatement.setInt(11, 0);
			}
			if (userDetails.getHaveExecutePermissionOnDataset() || isUserTobeAddedIsSuperUser) {
				preparedStatement.setInt(12, 1);
			} else {
				preparedStatement.setInt(12, 0);
			}
			if (userDetails.getHaveWritePermissionOnProject() || isUserTobeAddedIsSuperUser) {
				preparedStatement.setInt(13, 1);
			} else {
				preparedStatement.setInt(13, 0);
			}
			if (userDetails.getHaveExecutePermissionOnProject() || isUserTobeAddedIsSuperUser) {
				preparedStatement.setInt(14, 1);
			} else {
				preparedStatement.setInt(14, 0);
			}
			// preparedStatement.execute();
			preparedStatement.executeUpdate();
			rs = preparedStatement.getGeneratedKeys();
			if (rs.next()) {
				userId = rs.getLong(1);

				sqlQuery = ConnectionUtility.getSQlProperty("ADD_USERDETAILS_IN_GROUP_MEMBERSHIP_TABLE");
				preparedStatement1 = connection.prepareStatement(sqlQuery);
				// insert into group_membership
				// (group_id,user_id,created_at,createdBy,user_permission,group_admin)
				List<UserGroup> userGroupList = userDetails.getUserGroupList();
				//
				for (UserGroup userGroup : userGroupList) {
					String groupName = userGroup.getGroupName();
					// below if condition is added to make sure no entry is made
					// in group_membership table for admin user for group other
					// than admin group.
					if (!(isUserTobeAddedIsSuperUser & (!groupName.equals(UserManagementConstant.ADMIN_GROUP_NAME)))) {
						if (groupName.equals(UserManagementConstant.SUPER_USER_GROUP)) {
							role = UserManagementConstant.ADMIN_ROLE;
							// to make sure if a user is part of admin group his
							// permission should be read-write-execute
							userGroup.setPermissionLevel(UserManagementConstant.READ_WRITE_EXECUTE);
						}
						preparedStatement1.setString(1, groupName);
						preparedStatement1.setString(2, userDetails.getUserName());
						preparedStatement1.setString(3, userName);
						preparedStatement1.setInt(4, userGroup.getPermissionLevel());
						// TODO group admin need to be added
						preparedStatement1.setInt(5, 0);
						preparedStatement1.addBatch();
					}
				}
				preparedStatement1.executeBatch();
				sqlQuery = ConnectionUtility.getSQlProperty("ADD_USERDETAILS_IN_USER_ROLES_TABLE");// required
																									// for
																									// spring
																									// security
				preparedStatement2 = connection.prepareStatement(sqlQuery);
				preparedStatement2.setLong(1, userId);
				preparedStatement2.setString(2, role);
				preparedStatement2.execute();
				connection.commit();
				isAddedOrUpdated = true;
			}
		} catch (SQLException e) {
			LOGGER.error("SQLException while executing sql query string " + sqlQuery);
			try {
				// to avoid NullPointerException might be thrown as 'connection'
				// is nullable
				if (connection != null) {
					connection.rollback();
				}
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		} finally {
			try {
				connection.setAutoCommit(true);
				if (rs != null) {
					rs.close();
				}
				if (preparedStatement != null) {
					preparedStatement.close();
				}
				if (preparedStatement1 != null) {
					preparedStatement1.close();
				}
				if (preparedStatement2 != null) {
					preparedStatement2.close();
				}
				// to avoid NullPointerException might be thrown as 'connection'
				// is nullable
				if (connection != null) {
					connection.setAutoCommit(true);
				}
				if (connection != null) {
					connection.close();
				}
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return isAddedOrUpdated;
	}

	@Override
	public Boolean updateUser(String userName, UserDetails userDetails) throws Exception {

		// // check for super user - only super user can create group
		String role = UserManagementConstant.USER_ROLE;
		Long userId;
		Boolean isSuperUser = isSuperUser(userName);
		String userToBeUpdated = userDetails.getUserName();
		if (!isSuperUser) {
			throw new Exception("not allowed to view group list");
		}
		Boolean isUserTobeUpdatedIsSuperUser = isUserTobeAddedOrUpdatedIsSuperUser(userDetails);
		Boolean isUpdated = false;
		Connection connection = null;
		PreparedStatement preparedStatement = null;
		PreparedStatement preparedStatement1 = null;
		PreparedStatement preparedStatement2 = null;
		PreparedStatement preparedStatement3 = null;
		PreparedStatement preparedStatement4 = null;
		ResultSet rs = null;
		String sqlQuery = null;
		try {
			sqlQuery = ConnectionUtility.getSQlProperty("DELETE_USERDETAILS_IN_GROUP_MEMBERSHIP_TABLE");
			connection = ConnectionUtility.getConnection();
			connection.setAutoCommit(false);
			preparedStatement1 = connection.prepareStatement(sqlQuery);
			preparedStatement1.setString(1, userToBeUpdated);
			preparedStatement1.execute();
			sqlQuery = ConnectionUtility.getSQlProperty("UPDATE_USERDETAILS_IN_USER_TABLE");
			preparedStatement2 = connection.prepareStatement(sqlQuery);
			preparedStatement2.setString(1, userDetails.getEmail());
			preparedStatement2.setString(2, userDetails.getName());
			preparedStatement2.setString(3, userName);
			String dateOfBirth = userDetails.getDateOfBirth();
			// DEFAULT_DOB_TIMESTAMP will be used if dob is empty or null
			Long dobTimestamp = UserManagementConstant.DEFAULT_DOB_TIMESTAMP;
			// to handle scenario where request json doesn't include DOB field
			// or it is just a empty string
			if (!(dateOfBirth == null || dateOfBirth.equals(""))) {
				dobTimestamp = Long.parseLong(userDetails.getDateOfBirth());
			}
			preparedStatement2.setDate(4, new Date(dobTimestamp));
			Long contactNumber = userDetails.getContactNumber();
			if (contactNumber == null || (contactNumber == 0)) {

				// if contact number is null we are considering default contact
				// number
				contactNumber = UserManagementConstant.DEFAULT_CONTACT_NUMBER;
			} else {
				String contactNumberString = contactNumber.toString();
				// if the contact no size is more than
				// 'UserManagementConstant.SIZE_OF_CONTACT_NUMBER' then we
				// discarding additional digit
				if (contactNumberString.length() > UserManagementConstant.SIZE_OF_CONTACT_NUMBER) {
					contactNumber = Long
							.parseLong(contactNumberString.substring(0, UserManagementConstant.SIZE_OF_CONTACT_NUMBER));
				}
			}
			preparedStatement2.setLong(5, contactNumber);
			String gender = userDetails.getGender();
			if (gender == null || gender.equals("")) {
				gender = UserManagementConstant.DEFAULT_GENDER;
			}
			preparedStatement2.setString(6, gender);
			String address = userDetails.getAddress();
			if (address == null || dateOfBirth.equals("")) {
				address = UserManagementConstant.DEFAULT_ADDRESS;
			}
			preparedStatement2.setString(7, address);
			if (userDetails.getHaveWritePermissionOnDataset() || isUserTobeUpdatedIsSuperUser) {
				preparedStatement2.setInt(8, 1);
			} else {
				preparedStatement2.setInt(8, 0);
			}
			if (userDetails.getHaveExecutePermissionOnDataset() || isUserTobeUpdatedIsSuperUser) {
				preparedStatement2.setInt(9, 1);
			} else {
				preparedStatement2.setInt(9, 0);
			}
			if (userDetails.getHaveWritePermissionOnProject() || isUserTobeUpdatedIsSuperUser) {
				preparedStatement2.setInt(10, 1);
			} else {
				preparedStatement2.setInt(10, 0);
			}
			if (userDetails.getHaveExecutePermissionOnProject() || isUserTobeUpdatedIsSuperUser) {
				preparedStatement2.setInt(11, 1);
			} else {
				preparedStatement2.setInt(11, 0);
			}
			preparedStatement2.setString(12, userToBeUpdated);
			preparedStatement2.executeUpdate();
			sqlQuery = ConnectionUtility.getSQlProperty("GET_USER_ID");
			preparedStatement3 = connection.prepareStatement(sqlQuery);
			preparedStatement3.setString(1, userToBeUpdated);
			rs = preparedStatement3.executeQuery();

			if (rs.next()) {
				userId = rs.getLong(1);
				sqlQuery = ConnectionUtility.getSQlProperty("ADD_USERDETAILS_IN_GROUP_MEMBERSHIP_TABLE");
				preparedStatement = connection.prepareStatement(sqlQuery);
				List<UserGroup> userGroupList = userDetails.getUserGroupList();
				for (UserGroup userGroup : userGroupList) {
					String groupName = userGroup.getGroupName();
					// below if condition is added to make sure no entry is made
					// in group_membership table for admin user for group other
					// than admin group.
					if (!(isUserTobeUpdatedIsSuperUser
							& (!groupName.equals(UserManagementConstant.ADMIN_GROUP_NAME)))) {
						if (groupName.equals(UserManagementConstant.SUPER_USER_GROUP)) {
							role = UserManagementConstant.ADMIN_ROLE;
							// to make sure if a user is part of admin group his
							// permission should be read-write-execute
							userGroup.setPermissionLevel(UserManagementConstant.READ_WRITE_EXECUTE);
						}
						preparedStatement.setString(1, groupName);
						preparedStatement.setString(2, userDetails.getUserName());
						preparedStatement.setString(3, userName);
						preparedStatement.setInt(4, userGroup.getPermissionLevel());
						// TODO group admin need to be added
						preparedStatement.setInt(5, 0);
						preparedStatement.addBatch();
					}
				}
				preparedStatement.executeBatch();
				sqlQuery = ConnectionUtility.getSQlProperty("UPDATE_USERDETAILS_IN_USER_ROLES_TABLE");
				preparedStatement4 = connection.prepareStatement(sqlQuery);
				preparedStatement4.setString(1, role);
				preparedStatement4.setLong(2, userId);
				preparedStatement4.execute();
				isUpdated = true;
				connection.commit();
			}
		} catch (SQLException e) {
			LOGGER.error("SQLException while executing sql query string " + sqlQuery);
			try {
				// avoiding NullPointerException might be thrown as 'connection'
				// is nullable
				if (connection != null) {
					connection.rollback();
				}
			} catch (SQLException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
			e.printStackTrace();
		} finally {
			try {
				connection.setAutoCommit(true);
				if (rs != null) {
					rs.close();
				}
				if (preparedStatement != null) {
					preparedStatement.close();
				}
				if (preparedStatement1 != null) {
					preparedStatement1.close();
				}
				if (preparedStatement2 != null) {
					preparedStatement2.close();
				}
				if (preparedStatement3 != null) {
					preparedStatement3.close();
				}
				if (preparedStatement4 != null) {
					preparedStatement4.close();
				}
				// avoiding NullPointerException might be thrown as 'connection'
				// is nullable
				if (connection != null) {
					connection.setAutoCommit(true);
				}
				if (connection != null) {
					connection.close();
				}
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return isUpdated;

	}

	@Override
	public Map<String, Integer> getUserNamePermissionMap(String userName) throws Exception {
		Map<String, Integer> userNamePermissionMap = new HashMap<>();
		Connection connection = null;
		String sqlQuery = null;
		Map<String, Integer> groupNamePermissionMap = getGroupNamePermissionMap(userName);
		try {
			connection = ConnectionUtility.getConnection();
			for (Entry<String, Integer> entry : groupNamePermissionMap.entrySet()) {
				String groupName = entry.getKey();
				Integer permission = entry.getValue();
				PreparedStatement preparedStatement = null;
				ResultSet resultSet = null;
				try {
					sqlQuery = ConnectionUtility.getSQlProperty("GET_USER_LIST_FOR_GIVEN_GROUP");
					preparedStatement = connection.prepareStatement(sqlQuery);
					preparedStatement.setString(1, groupName);
					resultSet = preparedStatement.executeQuery();
					while (resultSet.next()) {
						String uName = resultSet.getString(1);
						Integer existingPermission = userNamePermissionMap.get(uName);
						if (existingPermission != null) {
							Integer newPermission = existingPermission | permission;
							userNamePermissionMap.put(uName, newPermission);
						} else {
							userNamePermissionMap.put(uName, permission);
						}
					}
				} catch (SQLException e) {
					LOGGER.error("SQLException while executing sql query string GET_GROUPNAME_PERMISSION_MAP");
					e.printStackTrace();
				} finally {
					if (preparedStatement != null) {
						try {
							preparedStatement.close();
						} catch (SQLException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
					}
					if (resultSet != null) {
						try {
							resultSet.close();
						} catch (SQLException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
					}
				}
			}
		} finally {
			if (connection != null) {
				try {
					connection.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}

		}
		return userNamePermissionMap;
	}

	@Override
	public Map<String, Integer> getGroupNamePermissionMap(String userName) throws Exception {
		Map<String, Integer> groupNamePermissionMap = new HashMap<>();
		Connection connection = null;
		String sqlQuery = null;
		PreparedStatement preparedStatement = null;
		ResultSet resultSet = null;
		try {
			connection = ConnectionUtility.getConnection();
			sqlQuery = ConnectionUtility.getSQlProperty("GET_GROUPNAME_PERMISSION_MAP");
			preparedStatement = connection.prepareStatement(sqlQuery);
			preparedStatement.setString(1, userName);
			resultSet = preparedStatement.executeQuery();
			while (resultSet.next()) {
				String groupName = resultSet.getString(1);
				Integer permission = resultSet.getInt(2);
				groupNamePermissionMap.put(groupName, permission);
			}
		} catch (SQLException e) {
			LOGGER.error("SQLException while executing sql query string GET_GROUPNAME_PERMISSION_MAP");
			e.printStackTrace();
		} finally {
			ConnectionUtility.releaseConnectionResources(resultSet, preparedStatement, connection);
		}
		return groupNamePermissionMap;
	}

	@Override
	public UserLevelPermission getUserLevelPermission(String userName) throws Exception {
		Connection connection = null;
		String sqlQuery = null;
		ResultSet rs = null;
		UserLevelPermission userLevelPermission = new UserLevelPermission();
		PreparedStatement preparedStatement = null;
		try {
			connection = ConnectionUtility.getConnection();
			sqlQuery = ConnectionUtility.getSQlProperty("GET_USER_LEVEL_PERMISSION");
			preparedStatement = connection.prepareStatement(sqlQuery);
			preparedStatement.setString(1, userName);
			rs = preparedStatement.executeQuery();
			if (rs.next()) {
				Boolean haveWritePermissionOnDataset = rs.getBoolean(1);
				Boolean haveExecutePermissionOnDataset = rs.getBoolean(2);
				Boolean haveWritePermissionOnProject = rs.getBoolean(3);
				Boolean haveExecutePermissionOnProject = rs.getBoolean(4);
				userLevelPermission.setHaveWritePermissionOnDataset(haveWritePermissionOnDataset);
				userLevelPermission.setHaveExecutePermissionOnDataset(haveExecutePermissionOnDataset);
				userLevelPermission.setHaveWritePermissionOnProject(haveWritePermissionOnProject);
				userLevelPermission.setHaveExecutePermissionOnProject(haveExecutePermissionOnProject);
			}
		} catch (SQLException e) {
			LOGGER.error("SQLException while executing sql query string GET_USER_LEVEL_PERMISSION");
			e.printStackTrace();
		} finally {
			ConnectionUtility.releaseConnectionResources(rs, preparedStatement, connection);
		}
		return userLevelPermission;
	}

	@Override
	public List<UserDetails> getUserList(String userName) throws Exception {
		// check for super user - only super user can create group
		if (!isSuperUser(userName)) {
			throw new Exception("not allowed to view group list");
		}
		List<UserDetails> userList = new ArrayList<UserDetails>();
		Connection connection = null;
		String sqlQuery = null;
		ResultSet rs = null;
		PreparedStatement preparedStatement = null;
		try {
			connection = ConnectionUtility.getConnection();
			sqlQuery = ConnectionUtility.getSQlProperty("LIST_USER");
			// LIST_USER = select * from user
			preparedStatement = connection.prepareStatement(sqlQuery);
			rs = preparedStatement.executeQuery();
			while (rs.next()) {
				UserDetails userDetails = new UserDetails();
				userDetails.setUserName(rs.getString("name"));
				userDetails.setName(rs.getString("display_name"));
				userDetails.setEmail(rs.getString("email"));
				userDetails.setIsDisabled(rs.getBoolean("isDisabled"));
				userDetails.setIsSuperUser(isSuperUser(userDetails.getUserName()));
				userList.add(userDetails);
			}
		} catch (SQLException e) {
			LOGGER.error("SQLException while executing sql query string LIST_USER");
			e.printStackTrace();
		} finally {
			ConnectionUtility.releaseConnectionResources(rs, preparedStatement, connection);
		}
		return userList;
	}

	@Override
	public UserDetails getUser(String callerName, String userId) throws Exception {
		Boolean isCallerSuperUser = isSuperUser(callerName);
		// caller should be either logged in user or super user
		if (!callerName.equals(userId)) {
			if (!isCallerSuperUser) {
				throw new Exception("not allowed to view group list");
			}
		}
		Boolean isSuperUser = isSuperUser(userId);
		UserDetails userDetails = new UserDetails();
		Connection connection = null;
		String sqlQuery = null;
		ResultSet rs = null;
		ResultSet rs1 = null;
		PreparedStatement preparedStatement = null;
		PreparedStatement preparedStatement1 = null;
		try {
			connection = ConnectionUtility.getConnection();
			sqlQuery = ConnectionUtility.getSQlProperty("GET_USER");
			// GET_USER= select * from user where name=?
			preparedStatement = connection.prepareStatement(sqlQuery);
			preparedStatement.setString(1, userId);
			rs = preparedStatement.executeQuery();
			if (rs.next()) {
				userDetails.setUserName(rs.getString("name"));
				userDetails.setName(rs.getString("display_name"));
				userDetails.setEmail(rs.getString("email"));
				userDetails.setCreatedBy(rs.getString("CREATED_BY"));
				userDetails.setCreatedBy(rs.getString("UPDATED_BY"));
				try {
					userDetails.setDateOfBirth(rs.getDate("dateOfBirth").toString());
				} catch (SQLException sqlException) {
					userDetails.setDateOfBirth(UserManagementConstant.DEFAULT_DATE_OF_BIRTH);
				}
				userDetails.setContactNumber(rs.getLong("contactNumber"));
				userDetails.setGender(rs.getString("gender"));
				userDetails.setAddress(rs.getString("address"));
				userDetails.setHaveWritePermissionOnDataset(rs.getBoolean("dataset_write_permission"));
				userDetails.setHaveExecutePermissionOnDataset(rs.getBoolean("dataset_execute_permission"));
				userDetails.setHaveWritePermissionOnProject(rs.getBoolean("project_write_permission"));
				userDetails.setHaveExecutePermissionOnProject(rs.getBoolean("project_execute_permission"));
				userDetails.setIsSuperUser(isSuperUser);
				List<UserGroup> userGroupList = new ArrayList<>();
				userDetails.setUserGroupList(userGroupList);
				// SELECT * FROM group_membership where user_id=?

				if (isSuperUser) {
					/*
					 * sqlQuery =
					 * ConnectionUtility.getSQlProperty("LIST_GROUP");
					 * preparedStatement1 =
					 * connection.prepareStatement(sqlQuery); rs1 =
					 * preparedStatement1.executeQuery(); while (rs1.next()) {
					 * UserGroup userGroup = new UserGroup();
					 * userGroup.setGroupName(rs1.getString("id")); userGroup
					 * .setPermissionLevel
					 * (UserManagementConstant.READ_WRITE_EXECUTE);
					 * userGroupList.add(userGroup); }
					 */
					userDetails.setGrayoutPermissionField(true);
					UserGroup userGroup = new UserGroup();
					userGroup.setGroupName(UserManagementConstant.ADMIN_GROUP_NAME);
					userGroup.setPermissionLevel(UserManagementConstant.READ_WRITE_EXECUTE);
					userGroupList.add(userGroup);

				} else {
					sqlQuery = ConnectionUtility.getSQlProperty("GET_GROUP_LEVEL_PERMISSION");
					preparedStatement1 = connection.prepareStatement(sqlQuery);
					preparedStatement1.setString(1, userId);
					rs1 = preparedStatement1.executeQuery();
					while (rs1.next()) {
						UserGroup userGroup = new UserGroup();
						userGroup.setGroupName(rs1.getString("group_id"));
						userGroup.setPermissionLevel(rs1.getInt("user_permission"));
						userGroupList.add(userGroup);
					}
				}
			}
		} catch (SQLException e) {
			LOGGER.error("SQLException while executing sql query string LIST_USER");
			e.printStackTrace();
		} finally {
			if (rs != null) {
				try {
					rs.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
			if (preparedStatement != null) {
				try {
					preparedStatement.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
			if (rs1 != null) {
				try {
					rs1.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
			if (preparedStatement1 != null) {
				try {
					preparedStatement1.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
			if (connection != null) {
				try {
					connection.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
		return userDetails;
	}

	@Override
	public Integer getPermissionForGivenResource(UserManagementConstant.ResourceType resourceType, Long resourceId,
			String userName) throws Exception {
		if (isSuperUser(userName)) {
			return UserManagementConstant.READ_WRITE_EXECUTE;
		}
		Integer maxPermission = 0;
		String sQuery;
		String resourceCreator = null;
		Boolean isProject = false, isDataset = false, isModule = false;
		PreparedStatement preparedStatement = null;
		PreparedStatement preparedStatement1 = null;
		Connection connection = null;
		ResultSet rs = null;
		ResultSet rs1 = null;
		try {
			if (resourceType.equals(UserManagementConstant.ResourceType.DATASET)) {
				isDataset = true;
				LOGGER.debug("resource type is: " + resourceType);
				sQuery = ConnectionUtility.getSQlProperty("GET_ENTITY_CREATOR");
			} else if (resourceType.equals(UserManagementConstant.ResourceType.PROJECT)) {
				isProject = true;
				LOGGER.debug("resource type is: " + resourceType);
				sQuery = ConnectionUtility.getSQlProperty("GET_PROJECT_CREATOR");
			} else if (resourceType.equals(UserManagementConstant.ResourceType.MODULE)) {
				isModule = true;
				LOGGER.debug("resource type is: " + resourceType);
				sQuery = ConnectionUtility.getSQlProperty("GET_MODULE_CREATOR");
			} else {
				LOGGER.info("invalid resource type: " + resourceType);
				throw new Exception("specified resource type" + resourceType + "is not valid");
			}
			// get resource creator
			connection = ConnectionUtility.getConnection();
			try {
				preparedStatement = connection.prepareStatement(sQuery);
				preparedStatement.setLong(1, resourceId);
				LOGGER.debug("preparedStatement: " + preparedStatement.toString());
				rs = preparedStatement.executeQuery();
				if (rs.next()) {
					resourceCreator = rs.getString("CREATED_BY");
				}
			}
			// catch (IOException e) {
			// e.printStackTrace();
			// throw new SqlIoException.IoException(
			// "IOException from function call
			// validateUserPermissionForResource");
			// // TODO should throw exception need to verify with anshuman
			// }
			catch (SQLException e) {
				e.printStackTrace();
				throw new Exception("SQLException from function call validateUserPermissionForResource");
			} finally {
				if (rs != null) {
					try {
						rs.close();
					} catch (SQLException e) {
						e.printStackTrace();
					}
				}
				if (preparedStatement != null) {
					try {
						preparedStatement.close();
					} catch (SQLException e) {
						e.printStackTrace();
					}
				}
			}

			// try {
			if (null != resourceCreator) {
				UserLevelPermission userLevelPermission = getUserLevelPermission(userName);
				Integer userLevPermission = null;
				Integer groupLevPermission = null;
				if (isProject) {
					userLevPermission = userLevelPermission.getProjectPermission();
				} else if (isDataset || isModule) {
					userLevPermission = userLevelPermission.getDatasetPermission();
				}
				if (resourceCreator.equals(userName)) {
					maxPermission = userLevPermission;
				} else {
					sQuery = ConnectionUtility.getSQlProperty("GET_PERMISSION_FOR_GIVEN_RESOURCE");
					preparedStatement1 = connection.prepareStatement(sQuery);
					preparedStatement1.setString(1, userName);
					preparedStatement1.setString(2, resourceCreator);
					rs1 = preparedStatement1.executeQuery();
					if (rs1.next()) {
						groupLevPermission = rs1.getInt(1);
						// Map<String, Integer> userNamePermissionMap =
						// getUserNamePermissionMap(userName);
						// groupLevPermission = userNamePermissionMap
						// .get(resourceCreator);
						if (groupLevPermission != null) {
							// if (groupLevPermission > userLevPermission) {
							// maxPermission = userLevPermission;
							// } else {
							// maxPermission = groupLevPermission;
							// }
							maxPermission = groupLevPermission & userLevPermission;
						}
					}
				}
			}
			LOGGER.debug("maximum permission for resource of type: " + resourceType + " with id: " + resourceId
					+ " for user: " + userName + "is: " + maxPermission);
		} catch (SQLException e) {
			e.printStackTrace();
			throw new Exception("SQLException from function call validateUserPermissionForResource");
		} finally {
			if (rs != null) {
				try {
					rs.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
			if (preparedStatement != null) {
				try {
					preparedStatement.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
			if (rs1 != null) {
				try {
					rs1.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
			if (preparedStatement1 != null) {
				try {
					preparedStatement1.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
			if (connection != null) {
				try {
					connection.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}

		}
		return maxPermission;
	}

	@Override
	public Group getGroup(String callerName, String groupName) throws Exception {
		Group group = new Group();
		if (isSuperUser(callerName)) {
			Connection connection;
			String sqlQuery = null;
			ResultSet rs = null;
			connection = ConnectionUtility.getConnection();
			PreparedStatement preparedStatement = null;
			try {
				sqlQuery = ConnectionUtility.getSQlProperty("GET_GROUP_INFO");
				// GET_GROUP_INFO= select * from groups where id=?
				preparedStatement = connection.prepareStatement(sqlQuery);
				preparedStatement.setString(1, groupName);
				rs = preparedStatement.executeQuery();
				if (rs.next()) {
					group.setDescription(rs.getString("description"));
					group.setGroupName(rs.getString("id"));
				}
			} catch (SQLException e) {
				LOGGER.error("SQLException while executing sql query string GET_GROUP_INFO");
				e.printStackTrace();
			} finally {
				ConnectionUtility.releaseConnectionResources(rs, preparedStatement, connection);
			}
		} else {
			throw new Exception("not allowed to view group list");
		}
		return group;
	}

	@Override
	public Boolean updateAccountStatus(Boolean tobeEnabled, String userId, String callerName) throws Exception {
		Boolean accountUpdateStatus = false;
		if (isSuperUser(callerName)) {
			Connection connection = null;
			String sqlQuery = null;
			PreparedStatement preparedStatement = null;
			try {
				connection = ConnectionUtility.getConnection();
				sqlQuery = ConnectionUtility.getSQlProperty("ENABLE_DISABLE_USER_ACCOUNT");
				// update user set isDisabled=? where name=?
				preparedStatement = connection.prepareStatement(sqlQuery);
				if (tobeEnabled) {
					preparedStatement.setInt(1, 0);
				} else {
					preparedStatement.setInt(1, 1);
				}
				preparedStatement.setString(2, userId);
				preparedStatement.executeUpdate();
				accountUpdateStatus = true;
			} catch (SQLException e) {
				LOGGER.error("SQLException while executing sql query string GET_GROUP_INFO");
				e.printStackTrace();
			} finally {
				ConnectionUtility.releaseConnectionResources(preparedStatement, connection);
			}
		} else {
			throw new Exception("not allowed to view group list");
		}
		return accountUpdateStatus;
	}

	/**
	 * Tells whether user which is going to be added or updated is superuser
	 * 
	 * @param userDetails
	 *            details of user
	 * @return true if user which is going to be added or updated is superuser
	 *         otherwise false
	 */
	private Boolean isUserTobeAddedOrUpdatedIsSuperUser(UserDetails userDetails) {
		Boolean isUserTobeUpdatedIsSuperUser = false;
		for (UserGroup userGroup : userDetails.getUserGroupList()) {
			if (userGroup.getGroupName().equals(UserManagementConstant.ADMIN_GROUP_NAME)) {
				isUserTobeUpdatedIsSuperUser = true;
				break;
			}
		}
		LOGGER.debug("user which is going to be added or updated is superuser: " + isUserTobeUpdatedIsSuperUser);
		return isUserTobeUpdatedIsSuperUser;
	}

	@Override
	public List<Group> getDisabledGroupList(String userName) throws Exception {

		// check for super user - only super user can create group
		if (!isSuperUser(userName)) {
			throw new Exception("not allowed to view group list");
		}
		List<Group> disabledGroupList = new ArrayList<Group>();
		Connection connection = null;
		String sqlQuery = null;
		ResultSet rs = null;
		PreparedStatement preparedStatement = null;
		try {
			connection = ConnectionUtility.getConnection();
			sqlQuery = ConnectionUtility.getSQlProperty("LIST_DISABLED_GROUP");
			// LIST_GROUP = select * from groups
			preparedStatement = connection.prepareStatement(sqlQuery);
			rs = preparedStatement.executeQuery();
			while (rs.next()) {
				Group group = new Group();
				group.setGroupName(rs.getString("id"));
				group.setDescription(rs.getString("description"));
				group.setIsSuperGroup(rs.getBoolean("superuser_group"));
				group.setIsdisabled(rs.getBoolean("isDisabled"));
				disabledGroupList.add(group);
			}
		} catch (SQLException e) {
			LOGGER.error("SQLException while executing sql query string LIST_GROUP");
			e.printStackTrace();
		} finally {
			ConnectionUtility.releaseConnectionResources(rs, preparedStatement, connection);
		}
		return disabledGroupList;
	}

	/**
	 * gives list of disable group name
	 * 
	 * @param callerName
	 *            user name of caller used for validating permission
	 * @return list of disable group name
	 * @throws Exception
	 */
	@SuppressWarnings("unused")
	private List<String> disableGroupNameList(String callerName) throws Exception {

		// check for super user - only super user can create group
		if (!isSuperUser(callerName)) {
			throw new Exception("not allowed to view group list");
		}
		List<String> disabledGroupNameList = new ArrayList<String>();
		Connection connection = null;
		String sqlQuery = null;
		ResultSet rs = null;
		PreparedStatement preparedStatement = null;
		try {
			connection = ConnectionUtility.getConnection();
			sqlQuery = ConnectionUtility.getSQlProperty("LIST_DISABLED_GROUP_NAME");
			preparedStatement = connection.prepareStatement(sqlQuery);
			rs = preparedStatement.executeQuery();
			while (rs.next()) {
				disabledGroupNameList.add(rs.getString("id"));
			}
		} catch (SQLException e) {
			LOGGER.error("SQLException while executing sql query string LIST_GROUP");
			e.printStackTrace();
		} finally {
			ConnectionUtility.releaseConnectionResources(rs, preparedStatement, connection);
		}
		return disabledGroupNameList;
	}
}
