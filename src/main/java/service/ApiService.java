package service;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

import javax.xml.bind.DatatypeConverter;

public class ApiService {

	private static final String username = null;

	public static void main(String[] args) throws MalformedURLException, Exception {
		String url = "http://13.126.228.155:8081/NotificationPlatform/getAllTopics";
		
		
		String res = new ApiService().getResponse(new URL(url));
		System.out.println(res);
	}

	private static void setProxy() {
		// TODO Auto-generated method stub
		 System.getProperties().put("http.proxyHost", "10.6.13.87");
	    System.getProperties().put("http.proxyPort", "8080");
	}

	private String getResponse(URL url) throws Exception {
		try {
			//copmment this when not in ITC network
			setProxy();
			
			HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
			urlConnection.setConnectTimeout(15000);
			urlConnection.setReadTimeout(10000);
			urlConnection.setRequestMethod("GET");
			InputStream is = urlConnection.getInputStream();
			InputStreamReader isr = new InputStreamReader(is);

			int numCharsRead;
			char[] charArray = new char[111024];
			StringBuffer sb = new StringBuffer();
			while ((numCharsRead = isr.read(charArray)) > 0) {
				sb.append(charArray, 0, numCharsRead);
			}
			String result = sb.toString();
			return result;

		} catch (Exception e) {
			throw new Exception("Exception while accessing Atlas api " + e.getMessage());
		}
	}
}
