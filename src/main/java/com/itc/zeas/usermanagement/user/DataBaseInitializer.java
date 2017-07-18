package com.itc.zeas.usermanagement.user;

import org.springframework.security.crypto.password.PasswordEncoder;


/**
 * Initialize the database with some test entries.
 */
public class DataBaseInitializer
{

	private UserDao userDao;

	private PasswordEncoder passwordEncoder;


	protected DataBaseInitializer()
	{
		/* Default constructor for reflection instantiation */
	}


	public DataBaseInitializer(UserDao userDao, PasswordEncoder passwordEncoder)
	{
		this.userDao = userDao;
		this.passwordEncoder = passwordEncoder;
	}

	/**
	 * Initializing method to insert default users to DB on initial load/start-up.
	 */
	public void initDataBase()
	{
		User userUser = new User("user", "User", this.passwordEncoder.encode("user"));
		userUser.addRole("user");
		this.userDao.save(userUser);

		User adminUser = new User("admin", "Administrator",this.passwordEncoder.encode("admin"));
		adminUser.addRole("user");
		adminUser.addRole("admin");
		this.userDao.save(adminUser);
		
	}

}