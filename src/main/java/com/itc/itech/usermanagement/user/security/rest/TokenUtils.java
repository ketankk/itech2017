package com.itc.itech.usermanagement.user.security.rest;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Set;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.codec.Hex;

import com.itc.itech.usermanagement.user.User;


public class TokenUtils
{

	public static final String MAGIC_KEY = "obfuscate";


	public static String createToken(UserDetails userDetails)
	{
		/* Expires in one hour */
		long expires = System.currentTimeMillis() + 1000L * 60 * 60;

		StringBuilder tokenBuilder = new StringBuilder();
		Set<String> roles = ((User)userDetails).getRoles();
		tokenBuilder.append(userDetails.getUsername());		
		tokenBuilder.append(":");
		tokenBuilder.append(((User)userDetails).getDisplay_name());
		tokenBuilder.append(":");
		tokenBuilder.append(expires);
		tokenBuilder.append(":");
		tokenBuilder.append(TokenUtils.computeSignature(userDetails, expires));
		tokenBuilder.append(":");
		tokenBuilder.append(roles.iterator().next());

		return tokenBuilder.toString();
	}


	public static String computeSignature(UserDetails userDetails, long expires)
	{
		StringBuilder signatureBuilder = new StringBuilder();
		signatureBuilder.append(userDetails.getUsername());
		signatureBuilder.append(":");
		signatureBuilder.append(((User)userDetails).getDisplay_name());
		signatureBuilder.append(":");
		signatureBuilder.append(expires);
		signatureBuilder.append(":");
		signatureBuilder.append(userDetails.getPassword());
		signatureBuilder.append(":");
		signatureBuilder.append(TokenUtils.MAGIC_KEY);

		MessageDigest digest;
		try {
			digest = MessageDigest.getInstance("MD5");
		} catch (NoSuchAlgorithmException e) {
			throw new IllegalStateException("No MD5 algorithm available!");
		}

		return new String(Hex.encode(digest.digest(signatureBuilder.toString().getBytes())));
	}


	public static String getUserNameFromToken(String authToken)
	{
		if (null == authToken) {
			return null;
		}

		String[] parts = authToken.split(":");
		return parts[0];
	}


	public static boolean validateToken(String authToken, UserDetails userDetails)
	{
		String[] parts = authToken.split(":");
		long expires = Long.parseLong(parts[2]);
		String signature = parts[3];

		if (expires < System.currentTimeMillis()) {
			return false;
		}

		return signature.equals(TokenUtils.computeSignature(userDetails, expires));
	}
}