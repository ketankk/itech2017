package dao;
import lombok.Data;

import java.lang.reflect.Field;
import java.sql.Timestamp;
import java.util.LinkedHashMap;
import java.util.Map;
/**
 * 
 * @author 19266
 *
 */
@Data
public class ZDPUserGroup {

	private String group_id;
	private String user_id;
	private Timestamp created;
	private String created_by;
	
	public ZDPUserGroup() {
		// TODO Auto-generated constructor stub
	}

	public ZDPUserGroup(String group_id, String user_id, Timestamp created,
			String created_by) {
		super();
		this.group_id = group_id;
		this.user_id = user_id;
		this.created = created;
		this.created_by = created_by;
	}
	
	/*
	 * return the column and their datatype
	 */
	public Map<String, String> getColumnNameAndType() {
		
		Map<String, String> columnAndType = new LinkedHashMap<String, String>();
		Class<?> objClass = this.getClass();
		Field[] fields = objClass.getDeclaredFields();
		String fkey_comp_type="";
		String fkey_proj_id="";
		for (Field f : fields) {
			
			//for foreign key
			
			try {
				String key=f.getName();
				Object val=f.get(this);

			} catch (IllegalArgumentException | IllegalAccessException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		
		}

		return columnAndType;
	}

	public Map<String, String> getColumnNameAndValue() {
		
		Map<String, String> columnNameAndValue= new LinkedHashMap<String, String>();
		Class<?> objClass = this.getClass();
		Field[] fields = objClass.getDeclaredFields();
		for (Field f : fields) {
			try {
				String key=f.getName();
				Object val=f.get(this);
					if (val != null) {
						columnNameAndValue.put(f.getName(), val.toString());
					} else {
						columnNameAndValue.put(key, "");
					}
			} catch (IllegalArgumentException |IllegalAccessException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		}

		return columnNameAndValue;
	}



	
}
