package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.log4j.Logger;

/**
 * include functionality such as validate given user name,adding Authentication
 * event to database
 * 
 * @author 19217
 * 
 */
public class AuthenticationLogManagerDao {
	public static Logger logger = Logger
			.getLogger(AuthenticationLogManagerDao.class);

	// @Autowired
	// private ConnectionUtility connUtil;

	/**
	 * validate whether given user name is valid or not
	 * 
	 * @param userName
	 *            user name which needs to be validated
	 * @return true if userName is valid otherwise false
	 * @throws Exception 
	 */
	public boolean validateUserName(String userName) throws Exception {

		boolean validUser = false;
		Connection connection = null;
		PreparedStatement preparedStatement = null;
		ResultSet rs = null;
		try {
			String sQuery = ConnectionUtility.getSQlProperty("GET_USER_ID");
			connection = ConnectionUtility.getConnection();
			preparedStatement = connection.prepareStatement(sQuery);
			preparedStatement.setString(1, userName);
			rs = preparedStatement.executeQuery();

			while (rs.next()) {
				validUser = true;
			}
		} catch (SQLException e) {
			e.printStackTrace();
			logger.error("EntityManager.validateUserName(): SQLException: "
					+ e.getMessage());
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
		return validUser;
	}

	/**
	 * Add Authentication event such as valid login,invalid login,logout to
	 * database
	 * 
	 * @param userName
	 *            user name
	 * @param eventType
	 *            Authentication event
	 * @param description
	 * @param clientIp
	 *            IP address of user machine
	 * @throws Exception 
	 */
	public void addAuthLogEventToDb(String userName, String eventType,
			String description, String clientIp) throws Exception {
		Connection connection = null;
		PreparedStatement preparedStatement = null;
		try {
			logger.debug("making a log entry for user " + userName
					+ " for  event " + eventType);
			String sQuery = ConnectionUtility
					.getSQlProperty("INSERT_LOG_ENTRY");
			connection = ConnectionUtility.getConnection();
			preparedStatement = connection.prepareStatement(sQuery);
			preparedStatement.setString(1, userName);
			preparedStatement.setString(2, eventType);
			preparedStatement.setString(3, clientIp);
			preparedStatement.setString(4, description);
			preparedStatement.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
			logger.error("EntityManager.addAuthLogEventToDb(): SQLException: "
					+ e.getMessage());
			throw e;
		} finally {
			if (preparedStatement != null) {
				preparedStatement.close();
			}
			if (connection != null) {
				connection.close();
			}
		}
		// finally {
		// closeConnection(connection);
		// }

	}
}
