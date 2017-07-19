package dao;

import java.util.List;

import lombok.Data;

/**
 * This model class holds the details of a user,(A user who has account for iTech application)
 */
@Data
public class UserDetails {
	private String userName;
	private String password;
	private String email;
	private String name;
	private String createdBy;
	private String updatedBy;
	private String dateOfBirth;// time in millisecond
	private Long contactNumber;
	private String gender;
	private String address;
	private Boolean haveWritePermissionOnDataset;
	private Boolean haveExecutePermissionOnDataset;
	private Boolean haveWritePermissionOnProject;
	private Boolean haveExecutePermissionOnProject;
	private List<UserGroup> userGroupList;
	private Boolean isDisabled;
	private Boolean isSuperUser;
	//Bug 90 will be used for grayout dataset/project permission checkbox in UI.
	private Boolean grayoutPermissionField;


//taken from other userdetails class
	private int userId;
	private String firstName;
	private String lastName;
	private String displayName;
	private Roles roles;
	private String newpassword;
	private String retypepassword;

}
