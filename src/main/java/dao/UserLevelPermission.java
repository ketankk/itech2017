package dao;


public class UserLevelPermission {
	private Boolean haveWritePermissionOnDataset;
	private Boolean haveExecutePermissionOnDataset;
	private Boolean haveWritePermissionOnProject;
	private Boolean haveExecutePermissionOnProject;

	public Boolean getHaveWritePermissionOnDataset() {
		return haveWritePermissionOnDataset;
	}

	public void setHaveWritePermissionOnDataset(
			Boolean haveWritePermissionOnDataset) {
		this.haveWritePermissionOnDataset = haveWritePermissionOnDataset;
	}

	public Boolean getHaveExecutePermissionOnDataset() {
		return haveExecutePermissionOnDataset;
	}

	public void setHaveExecutePermissionOnDataset(
			Boolean haveExecutePermissionOnDataset) {
		this.haveExecutePermissionOnDataset = haveExecutePermissionOnDataset;
	}

	public Boolean getHaveWritePermissionOnProject() {
		return haveWritePermissionOnProject;
	}

	public void setHaveWritePermissionOnProject(
			Boolean haveWritePermissionOnProject) {
		this.haveWritePermissionOnProject = haveWritePermissionOnProject;
	}

	public Boolean getHaveExecutePermissionOnProject() {
		return haveExecutePermissionOnProject;
	}

	public void setHaveExecutePermissionOnProject(
			Boolean haveExecutePermissionOnProject) {
		this.haveExecutePermissionOnProject = haveExecutePermissionOnProject;
	}

	public Integer getDatasetPermission() {
		Integer datasetPermission = UserManagementConstant.READ;
		if (this.getHaveWritePermissionOnDataset()) {
			datasetPermission = datasetPermission + 2;
		}
		if (this.getHaveExecutePermissionOnDataset()) {
			datasetPermission = datasetPermission + 1;
		}
		return datasetPermission;
	}

	public Integer getProjectPermission() {
		Integer projectPermission = UserManagementConstant.READ;
		if (this.getHaveWritePermissionOnProject()) {
			projectPermission = projectPermission + 2;
		}
		if (this.getHaveExecutePermissionOnProject()) {
			projectPermission = projectPermission + 1;
		}
		return projectPermission;
	}
}
