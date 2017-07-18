package dao;

import org.apache.log4j.Logger;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * Utility class which loads Configuration file from given location and provides
 * accessor method for accessing values for given Key.
 * 
 * @author 16795
 * 
 */
public class ConfigurationReader {
	static Logger LOG=Logger.getLogger(ConfigurationReader.class);
	public static Properties prop = new Properties();

	/**
	 * Init method loads the Property file.
	 */
	static {
		try {

			InputStream inputStream = new FileInputStream(System.getProperty("user.home")
					+ "/itech/config.properties");
			//props.load(fis);
			prop.load(inputStream);
		} catch (IOException ioE) {
			LOG.error("Error occured while loading Configuration property file "+ ioE.getMessage());
			ioE.printStackTrace();
		}
	}

	/**
	 * Accessor method for Property Value
	 * 
	 * @param key
	 *            {@link String} Name of the key for which value is requested.
	 * @return {@link String} property value.
	 */
	public static String getProperty(String key)  {
		String propVal=prop.getProperty(key);
		/*if(propVal==null)
			throw new ZeasException(ZeasErrorCode.CONFIGURTION_PROPERTY_NOT_FOUND,"Key not found in configuration file "+key);
		*/return propVal;
	}

}
