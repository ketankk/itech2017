package service;

import java.sql.SQLException;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;

import dao.AuthenticationLogManagerDao;

public class AuthenticationLogManager {
	public static Logger logger = Logger
			.getLogger(AuthenticationLogManager.class);
	public static final String VALIDLOGIN_DESCRIPTION = "Login is successful";
	public static final String INVALIDLOGIN_DESCRIPTION = "Login is unsuccessful";
	public static final String LOGOUT_DESCRIPTION = "logout is successful";
	
	
	
//	@Autowired
//	private AuthenticationLogManagerDao authLogManagerDao;
	
	
	

	public void logLoginEvent(String userName, LoginEvent loginEvent,
			HttpServletRequest request) throws Exception {
		switch (loginEvent) {
		case VALIDLOGIN:
			logValidLoginEvent(userName, request);
			break;
		case INVALIDLOGIN:
			logInvalidLoginEvent(userName, request);
			break;
		case LOGOUT:
			logLogoutEvent(userName, request);
			break;
		}
	}

	private void logLogoutEvent(String userName, HttpServletRequest request) throws Exception {
		logger.debug("making a logout entry for user " + userName);
		String clientIp = request.getRemoteAddr();
		logger.info("User " + userName + ": Logout success");
//		
//		try {
//			
//			logger.debug("---------------->"+authLogManagerDao);
//			
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
		
		AuthenticationLogManagerDao authLogManagerDao = new AuthenticationLogManagerDao();
		try {
			authLogManagerDao.addAuthLogEventToDb(userName, "logout",
					LOGOUT_DESCRIPTION, clientIp);
		} catch (SQLException e) {
			logger.error("SQLException from function logLogoutEvent ");
			e.printStackTrace();
		}
	}

	private void logValidLoginEvent(String userName, HttpServletRequest request) throws Exception {
		logger.debug("making a valid login entry for user " + userName);
		logger.info("User " + userName + ": Logon success");
		String clientIp = request.getRemoteAddr();
		AuthenticationLogManagerDao authLogManagerDao = new AuthenticationLogManagerDao();
		try {
			authLogManagerDao.addAuthLogEventToDb(userName, "login",
					VALIDLOGIN_DESCRIPTION, clientIp);
		} catch (SQLException e) {
			logger.error("SQLException from function logValidLoginEvent ");
			e.printStackTrace();
		}
	}

	private void logInvalidLoginEvent(String userName,
			HttpServletRequest request) throws Exception {
		AuthenticationLogManagerDao authLogManagerDao = new AuthenticationLogManagerDao();
		boolean validUser = authLogManagerDao.validateUserName(userName);
		if (validUser) {
			logger.debug("making a invalid login entry for user " + userName);
			logger.info("User " + userName + ": Logon failed");
			String clientIp = request.getRemoteAddr();
			try {
				authLogManagerDao.addAuthLogEventToDb(userName,
						"invalid-login", INVALIDLOGIN_DESCRIPTION, clientIp);
			} catch (SQLException e) {
				logger.error("SQLException from function logInvalidLoginEvent ");
				e.printStackTrace();
			}
		}
	}
}
