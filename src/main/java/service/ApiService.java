package service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

public class ApiService {


	public static void main(String[] args) throws MalformedURLException, Exception {
		String url = "https://lwkwmlb7f7.execute-api.us-east-1.amazonaws.com/prod/alldevice";
		
		
		String res = new ApiService().getResponse(new URL(url));
		System.out.println(res);
	}

	private static void setProxy() {
		// TODO Auto-generated method stub
		 System.getProperties().put("http.proxyHost", "10.6.13.87");
	    System.getProperties().put("http.proxyPort", "8080");
	}

	public String getResponse(URL url) throws Exception {
		try {
			//copmment this when not in ITC network
			//setProxy();
			
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
			throw new Exception("Exception while accessing AWS api " + e.getMessage());
		}
	}



	public String putResponse(URL url,String data) throws Exception {
		try {

			HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();

			urlConnection.setRequestMethod("POST");
			urlConnection.setDoOutput(true);
			urlConnection.setDoInput(true);

			OutputStream out = urlConnection.getOutputStream();

			BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(out, "UTF-8"));
			bw.write(data);
			bw.flush();
			bw.close();
			out.close();

			urlConnection.connect();
			int res = urlConnection.getResponseCode();
			return res+"";

		} catch (Exception e) {
			throw new Exception("Exception while accessing AWS api " + e.getMessage());
		}
	}
}
