package dao;


import lombok.Data;

/**
 * A model class to hold Address of an User
 */
@Data
public class Address {

	private String addressLine1;
	private String addressLine2;
	private String city;
	private String state;
	private String country;
	private String zipCode;
}
