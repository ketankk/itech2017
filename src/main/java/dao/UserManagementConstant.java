package dao;

/**
 * Include User Management related constants
 * 
 * @author 19217
 * 
 */
public interface UserManagementConstant {
	enum ResourceType {
		DATASET, PROJECT, MODULE
	}

	// Integer EXECUTE = 1;// 001
	// Integer WRITE = 2;// 010
	// Integer WRITE_EXECUTE = 3;// 011
	Integer READ = 4;// 100
	Integer READ_EXECUTE = 5;// 101
	Integer READ_WRITE = 6;// 110
	Integer READ_WRITE_EXECUTE = 7;// 111
	String DEFAULT_PASSWORD = "login@123";
	String SUPER_USER_GROUP = "admin";
	String ADMIN_ROLE = "admin";
	String USER_ROLE = "user";
	String ADMIN_GROUP_NAME = "admin";
	Long DEFAULT_DOB_TIMESTAMP = 0L;
	Integer SIZE_OF_CONTACT_NUMBER = 9;
	Long DEFAULT_CONTACT_NUMBER = 9999999999L;
	String DEFAULT_ADDRESS="";
	String DEFAULT_GENDER="Male";
	String DEFAULT_DATE_OF_BIRTH = "1970-01-01";
	
}
