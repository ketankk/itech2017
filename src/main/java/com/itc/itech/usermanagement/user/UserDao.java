package com.itc.itech.usermanagement.user;


import org.springframework.security.core.userdetails.UserDetailsService;


public interface UserDao extends Dao<User, Long>, UserDetailsService
{

	User findByName(String name);

}