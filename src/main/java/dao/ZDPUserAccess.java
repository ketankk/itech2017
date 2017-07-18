package dao;

import java.util.List;
import java.util.Map;

/**
 * contains a set of service specification to provide authorization support
 * 
 * @author 19217
 * 
 */
public interface ZDPUserAccess {

	
	/**
	 * Give List of Resource(Project or Dataset) Id with specified permission
	 * for given user
	 * 
	 * @param resourceType
	 *            Type of resource can be DATASET or PROJECT
	 * @param userName
	 *            Name of user requesting for resource id
	 * @param permission
	 *            Requested permission level
	 * 
	 * @return List of Resource(Project or Dataset) Id
	 */
	

	/**
	 * Validates whether user have specified permission for the resource or not
	 * 
	 * @param resourceType
	 *            Type of resource can be DATASET or PROJECT
	 * @param userName
	 *            Name of user
	 * @param resourceId
	 *            Id of resource for which permission needs to be validated
	 * @param permission
	 *            Permission level
	 * @return
	 * @throws Exception 
	 */
	Boolean validateUserPermissionForResource(
			UserManagementConstant.ResourceType resourceType, String userName,
			Long resourceId, Integer permission) throws Exception;

	/**
	 * Validates whether user have specified permission for the resource.In case
	 * of valid permission return maximum permission for the resource otherwise
	 * throw PermissionException.NotHaveRequestedPermissionException
	 * 
	 * @param resourceType
	 *            Type of resource can be DATASET or PROJECT
	 * @param userName
	 *            Name of user
	 * @param resourceId
	 *            Id of resource for which permission needs to be validated
	 * @param permission
	 *            Permission level
	 * @return In case of valid permission return maximum permission for the
	 *         resource otherwise throw
	 *         PermissionException.NotHaveRequestedPermissionException
	 * @throws Exception 
	 */
	Integer validateAndReturnMaxPermission(
			UserManagementConstant.ResourceType resourceType, String userName,
			Long resourceId, Integer permission) throws Exception;

	/**
	 * Gives list of group name which user belongs to
	 * 
	 * @param userName
	 *            Name of user
	 * @return List of group name for given user
	 */
	// List<String> getGroupsForUser(String userName);

	/**
	 * List all user who belongs to given group
	 * 
	 * @param groupName
	 *            Name of group
	 * @return List of user belonging to given group
	 */
	// List<String> getUsersForGroup(String groupName);

	/**
	 * Gives Resource Id and corresponding permission for resources shared with
	 * given group
	 * 
	 * @param resourceType
	 *            Type of resource can be DATASET or PROJECT
	 * @param groupName
	 *            Name of the group
	 * @return Map of Resource Id and corresponding permission
	 */
	// Map<Long, Integer> getSharedResourcesForGroup(
	// UserManagementConstant.ResourceType resourceType, String groupName);

	// Map<Long, Integer> getProjectsForGroup(String groupName);
	//
	// Map<Long, Integer> getDatasetsForGroup(String groupName);

	// //replaced with shareResource function
	// Boolean shareProject(String userName, Long projectId, String groupName,
	// Integer permission);
	//
	// Boolean shareDataset(String userName, Long moduleId, String groupName,
	// Integer permission);

	/**
	 * Share Resource with given group
	 * 
	 * @param resourceType
	 *            Type of resource can be DATASET or PROJECT
	 * @param userName
	 *            Name of user sharing the resource
	 * @param resourceId
	 *            Id of resource to be shared
	 * @param groupName
	 *            Name of group to which resource will be shared
	 * @param permission
	 *            permission with which resource will be shared
	 * @return True if sharing is successful otherwise false
	 */
	// Boolean shareResource(UserManagementConstant.ResourceType resourceType,
	// String userName, Long resourceId, String groupName,
	// Integer permission);

	// void logProjectEvent(Long projectId, String eventType, String userName,
	// String sharedWithGroup, String description);
	//
	// void logDatasetEvent(Long entityId, String eventType, String userName,
	// String sharedWithGroup, String description);
	/**
	 * 
	 * @param resourceType
	 * @param resourceId
	 * @param eventType
	 * @param userName
	 * @param sharedWithGroup
	 * @param description
	 * @throws Exception 
	 */
	void logEventPerfomedOnResources(
			UserManagementConstant.ResourceType resourceType, Long resourceId,
			String eventType, String userName, String sharedWithGroup,
			String description) throws Exception;

	/**
	 * Add a user to given group
	 * 
	 * @param group
	 *            Name name of group
	 * @param addedBy
	 * @param userName
	 *            Name of User
	 * @return True if a user is successfully added to specified group otherwise
	 *         False
	 */
	// Boolean addUserToGroup(String groupName, String addedBy, String
	// userName);

	/**
	 * Delete user from group
	 * 
	 * @param userName
	 *            Name of User
	 * @param groupName
	 *            Name of Group
	 * @return True if a user is successfully deleted from group otherwise False
	 */
	// Boolean deleteUserFromGroup(String userName, String groupName);

	/**
	 * Add an entry in resource permission table for default user group
	 * 
	 * @param resourceType
	 *            Type of resource can be DATASET or PROJECT
	 * @param resourceId
	 *            Resource id for which permission entry to be made
	 * @param userName
	 *            Name of user
	 * @return True if insertion is successful otherwise false
	 */
	// Boolean addEntryInResPermissionForDefaultUGroup(
	// UserManagementConstant.ResourceType resourceType, Long resourceId,
	// String userName);

	/**
	 * Gives Maximum permission for specified resource for given user
	 * 
	 * @param resourceType
	 *            type of resource
	 * @param resourceId
	 *            resource id
	 * @param userName
	 *            name of user
	 * @return Maximum permission for specified resource for given user
	 * @throws Exception 
	 */
	Integer getPermissionForGivenResource(
			UserManagementConstant.ResourceType resourceType, Long resourceId,
			String userName) throws Exception;

	// Boolean addEntryInDatasetPermission(String entityIdQuery,
	// String entityName, String userName, Integer permission);

	/**
	 * gives name of user who created the given project
	 * 
	 * @param projectId
	 *            id of project
	 * @return name of user who created the project
	 * @throws Exception 
	 */
	public String getProjectCreator(Long projectId) throws Exception;

	/**
	 * gives name of user who created the given entity
	 * 
	 * @param entityName
	 *            name of entity
	 * @return name of user who created this entity
	 * @throws Exception 
	 */
	public String getEntityCreator(String entityName) throws Exception;

	/**
	 * checks whether user(caller) can delete the Project or not
	 * 
	 * @param projectId
	 * @param userName
	 *            name of the calling user
	 * @return true or false depicting whether caller can delete the Project or
	 *         not
	 * @throws Exception 
	 */
	Boolean canDeleteProject(Long projectId, String userName) throws Exception;

	/**
	 * checks whether user(caller) can delete the DataSet or not
	 * 
	 * @param entityName
	 *            name of entity
	 * @param userName
	 *            name of the calling user
	 * @return true or false depicting whether caller can delete the DataSet or
	 *         not
	 * @throws Exception 
	 */
	Boolean canDeleteDatset(String entityName, String userName) throws Exception;

	/**
	 * checks given user is a super user or not
	 * 
	 * @param userName
	 *            name of user
	 * @return true if user is super user otherwise false
	 * @throws Exception 
	 */
	Boolean isSuperUser(String userName) throws Exception;

	/**
	 * It creates a group
	 * 
	 * @param groupName
	 *            name of group
	 * @param description
	 *            description about group
	 * @param createdBy
	 *            user who is creating this group
	 * @return true or false specifying success or failure
	 */
	Boolean createGroup(String groupName, String description, String createdBy)throws Exception;

	/**
	 * Updates a group
	 * 
	 * @param groupName
	 *            name of a group
	 * @param description
	 *            description string that needs to be updated
	 * @param callerName
	 *            name of a user
	 * @return true or false specifying success or failure
	 */
	Boolean updateGroup(String groupName, String description, String callerName)throws Exception;

	/**
	 * deletes a group
	 * 
	 * @param groupName
	 *            name of a group
	 * @param userName
	 *            name of a user
	 * @return true or false specifying success or failure
	 */
	Boolean deleteGroup(String groupName, String userName)throws Exception;

	/**
	 * checks given user name is available or not
	 * 
	 * @param groupName
	 *            name of group to be checked
	 * @return true if group name is available otherwise false
	 */
	Boolean isGroupNameAvailable(String groupName)throws Exception;

	// if requesting user is superuser otherwise
	// 'PermissionException.NotASuperUserException' will be thrown
	/**
	 * list all the existing group
	 * 
	 * @param userName
	 *            user name of caller
	 * @return list of group
	 */
	List<Group> getGroupList(String userName)throws Exception;

	/**
	 * list all groups which are disabled
	 * 
	 * @param userName
	 *            user name of caller
	 * @return disabled group list
	 */
	List<Group> getDisabledGroupList(String userName)throws Exception;

	/**
	 * add a user
	 * 
	 * @param userName
	 *            name of user
	 * @param userDetails
	 *            POJO details representing user details
	 * @return true or false representing success or failure respectively
	 */
	Boolean addUser(String userName, UserDetails userDetails)throws Exception;

	Map<String, Integer> getUserNamePermissionMap(String userName) throws Exception;

	Map<String, Integer> getGroupNamePermissionMap(String userName) throws Exception;

	UserLevelPermission getUserLevelPermission(String userName) throws Exception;

	List<UserDetails> getUserList(String userName) throws Exception;

	UserDetails getUser(String callerName, String userId) throws Exception;

	Boolean updateUser(String userName, UserDetails userDetails)throws Exception;

	Group getGroup(String callerName, String groupName)throws Exception;

	Boolean updateAccountStatus(Boolean tobeEnabled, String userId,
			String callerName)throws Exception;

}
