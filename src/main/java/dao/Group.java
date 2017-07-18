package dao;

import lombok.Data;

@Data
public class Group {
	private String groupName;
	private String description;
	private Boolean isSuperGroup;
	//Bug 89
	private Boolean isdisabled; 

}
