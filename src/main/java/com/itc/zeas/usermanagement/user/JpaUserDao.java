package com.itc.zeas.usermanagement.user;

import java.util.List;

import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Path;
import javax.persistence.criteria.Root;


import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;


public class JpaUserDao  extends JpaDao<User, Long> implements UserDao
{
	public JpaUserDao()
	{
		super(User.class);
	}


	@Override
	@Transactional(readOnly = true)
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException
	{
		User user = this.findByName(username);
		if (null == user) {
			throw new UsernameNotFoundException("The user with name " + username + " was not found");
		}
	/*	 user = new User("user", this.passwordEncoder.encode("user"));
		user.addRole("user");	*/	
		System.out.println("find out here =="+user.getPassword());
		return user;
	}


	@Override
	@Transactional(readOnly = true)
	public User findByName(String name)
	{
		final CriteriaBuilder builder = this.getEntityManager().getCriteriaBuilder();
		final CriteriaQuery<User> criteriaQuery = builder.createQuery(this.entityClass);

		Root<User> root = criteriaQuery.from(this.entityClass);
		Path<String> namePath = root.get("name");
		criteriaQuery.where(builder.equal(namePath, name));

		TypedQuery<User> typedQuery = this.getEntityManager().createQuery(criteriaQuery);
		List<User> users = typedQuery.getResultList();
		this.getEntityManager().close();
		if (users.isEmpty()) {
			return null;
		}
		
		/*User user = new User("user", this.passwordEncoder.encode("user"));
			user.addRole("user");		
			System.out.println("findByName =="+user.getPassword());*/

		return users.iterator().next();
	}


	@Override
	public List<User> findAll() {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public User find(Long id) {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public User save(User newsEntry) {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public void delete(Long id) {
		// TODO Auto-generated method stub
		
	}

}
