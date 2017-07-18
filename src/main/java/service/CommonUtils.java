package service;

import lombok.Data;
import org.json.JSONObject;

import javax.servlet.http.HttpServletRequest;


/*
 * This class contains common utility functions
 */
@Data
public class CommonUtils {

	private int schId;
	private String format;
	private String schema;
	private String dataSet;
	String dataSource;
	private String frequency;

	String jsonData;
	JSONObject schJsonObj = new JSONObject();



	/**
	 * Retreives access token from http request
	 * 
	 * @param httpRequest
	 * @return
	 */
	public String extractAuthTokenFromRequest(HttpServletRequest httpRequest) {
		/* Get token from header */
		String authToken = httpRequest.getHeader("X-Auth-Token");

		/* If token not found get it from request parameter */
		if (authToken == null) {
			authToken = httpRequest.getParameter("token");
		}

		return authToken;
	}

	/**
	 * gives the user name for a given access token string
	 * 
	 * @param authToken
	 * @return
	 */
	public String getUserNameFromToken(String authToken) {
		if (null == authToken) {
			return null;
		}

		String[] parts = authToken.split(":");
		return parts[0];
	}

	/**
	 * Retrieves user name from HttpServletRequest
	 * 
	 * @param httpRequest
	 * @return user name
	 */
	public String extractUserNameFromRequest(HttpServletRequest httpRequest) {
		String authToken = extractAuthTokenFromRequest(httpRequest);
		String userName = getUserNameFromToken(authToken);
		return userName;
	}
}
