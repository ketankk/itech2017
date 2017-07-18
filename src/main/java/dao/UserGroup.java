package dao;

import lombok.Data;

/**
 * Model class for holding groupname of user and permission level of that group
 */
@Data
public class UserGroup {
	private String groupName;
	// permission level should
	// 4-read,5-read-execute,6-read-write,7-read-write-execute
	private Integer permissionLevel;


}
