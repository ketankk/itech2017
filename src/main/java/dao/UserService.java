package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.StandardPasswordEncoder;

public class UserService {

	/**
	 * Using spring StandardPasswordEncoder to encode the password
	 */
	private PasswordEncoder passwordEncoder = new StandardPasswordEncoder("ThisIsASecretSoChangeMe");
	private static final Logger LOGGER = Logger.getLogger(UserService.class);

	
	/**
	 * this method is used to list all the existing users
	 * 
	 * @return userList
	 * @throws Exception
	 */
	public List<UserDetails> getUsers() throws Exception {
		List<UserDetails> userList = new ArrayList<UserDetails>();
		Connection connection = null;
		Statement statement = null;
		ResultSet rs = null;
		try {
			connection = ConnectionUtility.getConnection();
			statement = connection.createStatement();
			String sQuery = ConnectionUtility.getSQlProperty("LIST_USERS");
			rs = statement.executeQuery(sQuery);
			while (rs.next()) {
				UserDetails userDetails = new UserDetails();
				Roles roles = new Roles();
				userDetails.setUserId(rs.getInt("id"));
				userDetails.setUserName(rs.getString("name"));
				userDetails.setEmail(rs.getString("email"));
				userDetails.setDisplayName(rs.getString("display_name"));
				roles.setRolesName(rs.getString("roles"));
				userDetails.setRoles(roles);
				userList.add(userDetails);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			ConnectionUtility.releaseConnectionResources(statement, connection);

		}
		LOGGER.info("User List \n" + userList.toString());
		return userList;
	}

	/**
	 * This method is get user details by user id
	 * 
	 * @param id
	 * @return UserDetails
	 * @throws Exception
	 */
	public UserDetails getUserById(Integer id) throws Exception {
		UserDetails userDetails = null;
		Connection connection = ConnectionUtility.getConnection();
		PreparedStatement preparedStatement = null;
		ResultSet rs = null;
		try {
			String sQuery = ConnectionUtility.getSQlProperty("SELECT_USER_BY_ID");
			preparedStatement = connection.prepareStatement(sQuery);
			preparedStatement.setInt(1, id);
			rs = preparedStatement.executeQuery();
			while (rs.next()) {
				userDetails = new UserDetails();
				Roles roles = new Roles();

				userDetails.setUserId(rs.getInt("id"));
				userDetails.setUserName(rs.getString("name"));
				// userDetails.setPassword(rs.getString("password"));
				userDetails.setEmail(rs.getString("email"));
				userDetails.setDisplayName(rs.getString("display_name"));
				roles.setRolesName(rs.getString("roles"));
				userDetails.setRoles(roles);
				System.out.println("chkQ" + userDetails);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			if (rs != null) {
				rs.close();
			}
			if (preparedStatement != null) {
				preparedStatement.close();
			}
			if (connection != null) {
				connection.close();
			}
		}

		return userDetails;
	}

	/**
	 * This method is to add new user
	 * 
	 * @param userDetails
	 * @throws Exception
	 */
	public void addUsers(UserDetails userDetails) throws Exception {
		Connection connection = null;
		PreparedStatement insertUserStatement = null;
		PreparedStatement insertRoleStatement = null;
		PreparedStatement insertgroupStatement = null;
		try {
			connection = ConnectionUtility.getConnection();
			connection.setAutoCommit(false);
			String userName = userDetails.getUserName();
			String sQuery = ConnectionUtility.getSQlProperty("INSERT_USER");
			insertUserStatement = connection.prepareStatement(sQuery);
			insertUserStatement.setString(1, userName);
			// TODO Do this in service layer..passwordencoder
			insertUserStatement.setString(2, passwordEncoder.encode(userDetails.getPassword()));
			insertUserStatement.setString(3, userDetails.getEmail());
			insertUserStatement.setString(4, userDetails.getDisplayName());
			insertUserStatement.executeUpdate();

			String srQuery = ConnectionUtility.getSQlProperty("INSERT_ROLES");
			insertRoleStatement = connection.prepareStatement(srQuery);
			insertRoleStatement.setInt(1, getUserID(userName));
			insertRoleStatement.setString(2, userDetails.getRoles().getRolesName());
			insertRoleStatement.executeUpdate();
			String defaultgroupQuery = ConnectionUtility.getSQlProperty("CREATE_DEFAULT_GROUP");
			insertgroupStatement = connection.prepareStatement(defaultgroupQuery);
			insertgroupStatement.setString(1, userName);
			insertgroupStatement.setString(2, "default user group for" + userName);
			insertgroupStatement.setString(3, "Admin");
			insertgroupStatement.executeUpdate();
			// TODO

			connection.commit();
			connection.setAutoCommit(true);

		} catch (SQLException e) {
			e.printStackTrace();
		} finally {

			if (insertUserStatement != null) {
				insertUserStatement.close();
			}
			if (insertRoleStatement != null) {
				insertRoleStatement.close();
			}
			if (insertgroupStatement != null) {
				insertgroupStatement.close();
			}
			if (connection != null) {
				connection.close();
			}

		}

	}

	/**
	 * this method is to update user
	 * 
	 * @param userDetails
	 * @param userId
	 * @throws Exception
	 */
	public void updateUsers(UserDetails userDetails, Integer userId) throws Exception {
		Connection connection = null;
		PreparedStatement preparedStatement = null;
		try {
			connection = ConnectionUtility.getConnection();
			String sQuery = ConnectionUtility.getSQlProperty("UPDATE_USER");
			preparedStatement = connection.prepareStatement(sQuery);
			preparedStatement.setString(1, userDetails.getUserName());
			preparedStatement.setString(2, userDetails.getEmail());
			preparedStatement.setString(3, userDetails.getDisplayName());
			preparedStatement.setString(4, userDetails.getRoles().getRolesName());
			preparedStatement.setInt(5, userId);
			preparedStatement.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			if (preparedStatement != null) {
				preparedStatement.close();
			}
			if (connection != null) {
				connection.close();
			}
		}

	}

	/**
	 * this method is used to delete users
	 * 
	 * @param userId
	 * @throws Exception
	 */
	public void deleteUsers(Integer userId) throws Exception {
		Connection connection = null;
		PreparedStatement preparedStatement = null;
		try {
			connection = ConnectionUtility.getConnection();
			String sQuery = ConnectionUtility.getSQlProperty("DELETE_USER_ROLES");
			preparedStatement = connection.prepareStatement(sQuery);
			preparedStatement.setInt(1, userId);
			preparedStatement.executeUpdate();

			String query = ConnectionUtility.getSQlProperty("DELETE_USER");
			PreparedStatement preStatement = connection.prepareStatement(query);
			preStatement.setInt(1, userId);
			preStatement.executeUpdate();

		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			if (preparedStatement != null) {
				preparedStatement.close();
			}
			if (connection != null) {
				connection.close();
			}
		}

	}

	/**
	 * this method is to return userid using unique username
	 * 
	 * @param userName
	 * @return userId
	 * @throws Exception
	 */
	public int getUserID(String userName) throws Exception {
		Connection connection = null;
		PreparedStatement preparedStatement = null;
		ResultSet rs = null;
		int userId = 0;
		try {
			connection = ConnectionUtility.getConnection();
			String sQuery = ConnectionUtility.getSQlProperty("GET_USER_ID");
			preparedStatement = connection.prepareStatement(sQuery);
			preparedStatement.setString(1, userName);
			rs = preparedStatement.executeQuery();
			while (rs.next()) {
				userId = rs.getInt("id");
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			if (rs != null) {
				rs.close();
			}
			if (preparedStatement != null) {
				preparedStatement.close();
			}
			if (connection != null) {
				connection.close();
			}
		}
		return userId;
	}

	/**
	 * this method is to update password
	 * 
	 * @param userDetails
	 * @param userName
	 * @throws Exception
	 */
	public void updatePassword(UserDetails userDetails, String userName) throws Exception {
		Connection connection = null;
		PreparedStatement preparedStatement = null;
		try {
			connection = ConnectionUtility.getConnection();
			String sQuery = ConnectionUtility.getSQlProperty("UPDATE_USER_PASSWORD");
			preparedStatement = connection.prepareStatement(sQuery);
			preparedStatement.setString(1, passwordEncoder.encode(userDetails.getNewpassword()));
			preparedStatement.setString(2, userName);
			preparedStatement.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			if (preparedStatement != null) {
				preparedStatement.close();
			}
			if (connection != null) {
				connection.close();
			}
		}
	}

	/**
	 * this method is for forget password
	 * 
	 * @param userDetails
	 * @throws Exception
	 */
	public void forgetPassword(String userName) throws Exception {
		Connection connection = null;
		PreparedStatement preparedStatement = null;
		try {
			connection = ConnectionUtility.getConnection();
			String sQuery = ConnectionUtility.getSQlProperty("UPDATE_USER_PASSWORD");
			preparedStatement = connection.prepareStatement(sQuery);
			preparedStatement.setString(1, passwordEncoder.encode("login@123"));
			preparedStatement.setString(2, userName);
			preparedStatement.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			if (preparedStatement != null) {
				preparedStatement.close();
			}
			if (connection != null) {
				connection.close();
			}
		}
	}

	/**
	 * this method is to check user name availability
	 * 
	 * @param userName
	 * @return exists
	 * @throws Exception
	 */
	public boolean checkAvailability(String userName) throws Exception {
		boolean exists = false;
		Connection connection = null;
		PreparedStatement preparedStatement = null;
		ResultSet rs = null;
		try {
			connection = ConnectionUtility.getConnection();
			String sQuery = ConnectionUtility.getSQlProperty("CHECK_USER_AVAILABILITY");
			preparedStatement = connection.prepareStatement(sQuery);
			preparedStatement.setString(1, userName);
			rs = preparedStatement.executeQuery();
			if (rs.next()) {
				exists = true;
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			if (rs != null) {
				rs.close();
			}
			if (preparedStatement != null) {
				preparedStatement.close();
			}
			if (connection != null) {
				connection.close();
			}
		}
		return exists;
	}

	/**
	 * this method is to get user password from database
	 * 
	 * @param userName
	 * @return password
	 * @throws Exception
	 */
	public String getUserPassword(String userName) throws Exception {
		String password = null;
		Connection connection = null;
		PreparedStatement preparedStatement = null;
		ResultSet rs = null;
		try {
			connection = ConnectionUtility.getConnection();
			String sQuery = ConnectionUtility.getSQlProperty("GET_USER_PASSWORD");
			preparedStatement = connection.prepareStatement(sQuery);
			preparedStatement.setString(1, userName);
			rs = preparedStatement.executeQuery();

			while (rs.next()) {
				password = rs.getString("password");
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			if (rs != null) {
				rs.close();
			}
			if (preparedStatement != null) {
				preparedStatement.close();
			}
			if (connection != null) {
				connection.close();
			}
		}
		return password;
	}

}
