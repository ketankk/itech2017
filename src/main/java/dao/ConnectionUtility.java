package dao;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;

import org.hibernate.PropertyNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ConnectionUtility {

	private static final Logger LOG = LoggerFactory.getLogger(ConnectionUtility.class);

	/**
	 * Gives database connection
	 * 
	 * @return database connection
	 */
	public static Connection getConnection() {
		LOG.debug("Trying to get the connection");
		Connection connection = ITECHDataSource.INSTANCE.getConnection();
		LOG.debug("Got the connection successfully");
		return connection;
	}

	public static String getSQlProperty(String param) throws Exception {
		InputStream inputStream = null;
		String sqlQuery = null;

		// try {
		Properties prop = new Properties();
		try {
			inputStream = new FileInputStream(System.getProperty("user.home") + "/itech/SQLEditor.properties");
		} catch (FileNotFoundException e) {
			LOG.error("SQLEditor.properties file not found");
			throw new FileNotFoundException("SQLEditor.properties file not found");
		}
		try {
			prop.load(inputStream);
			sqlQuery = prop.getProperty(param);

		} catch (IOException e) {
			LOG.error("SQL Property :" + param + " not found \n" + e.getMessage());
			throw new PropertyNotFoundException("SQL Property :" + param + " not found \n");
		} finally {
			if (inputStream != null) {
				try {
					inputStream.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
		if(sqlQuery==null)
			throw new PropertyNotFoundException("SQL Property :" + param + " not found \n");

		return sqlQuery;

	}

	

	/**
 	 * release the connection resource passed to this function
	 * @param resultSet
	 * @param preparedStatement
	 * @param connection
	 */
	public static void releaseConnectionResources(ResultSet resultSet, PreparedStatement preparedStatement,
			Connection connection) {
		LOG.debug("Releasing the connection resources");
		if (resultSet != null) {
			try {
				resultSet.close();
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

	/**
	 * release the connection resource passed to this function
	 * 
	 * @param preparedStatement
	 * @param connection
	 */
	public static void releaseConnectionResources(PreparedStatement preparedStatement, Connection connection) {
		LOG.debug("Releasing the connection resources");
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
	/**
	 * 
	 * @param resultSet
	 * @param statement
	 * @param connection
	 */
	public static void releaseConnectionResources(ResultSet resultSet,Statement statement, Connection connection) {
		LOG.debug("Releasing the connection resources");
		if(resultSet!=null){
			try {
				resultSet.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		if (statement != null) {
			try {
				statement.close();
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

	/**
	 * release the connection resource passed to this function
	 * 
	 * @param statement
	 * @param connection
	 */
	public static void releaseConnectionResources(Statement statement, Connection connection) {
		LOG.debug("Releasing the connection resources");
		if (statement != null) {
			try {
				statement.close();
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
}
