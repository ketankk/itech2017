package com.itc.zeas.usermanagement.user;

import java.io.Serializable;
import java.util.List;


public interface Dao<T extends Serializable, I>
{

	List<T> findAll();


	T find(I id);


	T save(T newsEntry);


	void delete(I id);

}