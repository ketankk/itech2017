<div ng-controller="allSources">
	<form role="form" class="form">
		<div class="well">
			<div class="row-fluid">
				<div class="row-fluid">
					<div class="form-group">
						<div class="col-sm-8 col-md-4 col-lg-4">
							<div>
								<input id="sourceName" type="text" class="form-control"
									name="name" " placeholder="Source Name" ng-model="dataSrc.name"
									editable-text="editname" required />
							</div>
						</div>
					</div>
				</div>
				<div class="clearfix visible-xs-block"></div>
				<div class="row-fluid">
					<div class="form-group">

						<div class="col-sm-8 col-md-4 md-lg-4">
							<input type="text" class="form-control" placeholder="Source Path"
								name="location" ng-model="dataSrc.location">
						</div>
					</div>

				</div>
				<div class="row-fluid">
					<div class="form-group">

						<div class="col-sm-8 col-md-4 md-lg-4">
							<input type="text" class="form-control" placeholder="Source Type"
								name="type" ng-model="dataSrc.type">
						</div>
					</div>

				</div>
				<div class="row-fluid">
					<div class="form-group">

						<div class="col-sm-8 col-md-4 md-lg-4">
							<input type="text" class="form-control"
								placeholder="Source Schema Name" name="schema"
								ng-model="dataSrc.schema">
						</div>
					</div>

				</div>

				<div class="clearfix visible-xs-block"></div>
				<div class="row-fluid">
					<div class="form-group">
						<div class="col-sm-12 col-md-12 col-lg-12">
							<!-- 	<div class="checkbox">
								<label><input id="login-remember" type="checkbox"
									name="remember" value="1" ng-model="dbaccess"> DB
									Access?</label>
							</div> -->
							<!-- <div>
								<span data-toggle="modal" data-target="#schedular"
									class="text-primary"> <i
									class="glyphicon glyphicon-time"></i> Add a Scheduler
								</span>
							</div>-->
						</div>

					</div>
				</div>
				<div class="clearfix visible-xs-block"></div>
				<div class="row-fluid">
					<div class="form-group">
						<div class="col-sm-6 col-md-5 col-lg-5">
							<label class="col-sm-4 col-md-4 col-lg-4 control-label"
								for="selectSchemaType">Select Frequency</label>
							<div class="col-sm-8 col-md-8 col-lg-8">

								<select class="form-control" ng-options="o for o in  frequencyT"
									ng-model="dataSrc.frequency" name="frequency"></select>
							</div>
						</div>



					</div>
				</div>
				<div class="clearfix visible-xs-block"></div>
				<div id="dbBOX">

					<div class="row-fluid">
						<div class="form-group">
							<div class="col-sm-6 col-md-5 col-lg-5">
								<label class="col-sm-4 col-md-4 col-lg-4 control-label"
									for="selectSchemaType">Select Schema Type</label>
								<div class="col-sm-8 col-md-8 col-lg-8">

									<select class="form-control" ng-options="o for o in  vendors"
										ng-model="dataSrc.format" name="format"></select>
								</div>
							</div>



						</div>
					</div>
					<div class="clearfix visible-xs-block"></div>

					<!-- 	<div class="row-fluid" ng-repeat="dd in ddArray">
						<div class="form-group">

							<div class="col-sm-6 col-md-5 col-lg-5">
								<label class="col-sm-4 col-md-4 col-lg-4  control-label"
									for="selectDB">Dictionary Name</label>
								<div class="col-sm-8 col-md-8 col-lg-8 ">
									<input type="text" class="form-control"
										placeholder="Dictionary Name" ng-model="dd.DDName" />
								</div>
							</div>

							<div class="col-sm-6 col-md-5 col-lg-5">
								<label class="col-sm-4 col-md-4 col-lg-4 control-label"
									for="selectDB">Dictionary Type</label>
								<div class="col-sm-8 col-md-8 col-lg-8 ">
									<input type="text" class="form-control"
										placeholder="Dictionary Name" ng-model="dd.DDDType" />
								</div>
							</div>







						</div>
					</div>-->
					<div class="clearfix visible-xs-block"></div>


				</div>
			</div>
		</div>

		<div class="col-sm-12 controls">
			<input type="button" data-toggle="modal"
				data-target="#testConnectionModal" class="btn btn-primary"
				name="testC" value="Test Connection" ng-show="dbaccess" /> <input
				type="submit" class="btn btn-primary" name="Save" value="Save"
				ng-click="closeDBBox(dataSrc, ddArray)" /> <input type="submit"
				id="btn-login" class="btn btn-default" name="Cancel" value="Cancel"
				ng-click="cancelADD();" />
		</div>
	</form>

</div>
<div class="modal" id="testConnectionModal" tabindex="-1" role="dialog"
	aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">
					<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
				</button>
				<h4 class="modal-title" id="myModalLabel">Test result</h4>
			</div>
			<div class="modal-body">Test Connection Successful!</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>
<div class="modal" id="saveConnectionModal" tabindex="-1" role="dialog"
	aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">
					<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
				</button>
				<h4 class="modal-title" id="myModalLabel">Save</h4>
			</div>
			<div class="modal-body">Successfully saved!</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
			</div>
		</div>

	</div>
</div>
<!--   Scheduler Modal Starts-->
<div class="modal fade" id="schedular" tabindex="-1" role="dialog"
	aria-labelledby="schedularModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">
					<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
				</button>
				<h4 class="modal-title" id="schedularModalLabel">Scheduler</h4>
			</div>
			<div class="modal-body">
				<div class="panel panel-primary">
					<div class="panel-body">Frequency</div>
					<div class="panel-footer">
						Start Time : <select ng-options="o for o in  timeHours"
							ng-model="setStartHours"></select> <select
							ng-model="setStartMinutes" ng-options="o for o in timeMinutes"></select>
						<p>
							Date: <input type="text" id="datepicker" datepicker>
						</p>
					</div>
					<div class="panel-footer">
						End Time : <select ng-options="o for o in timeHours"
							ng-model="setEndHours"></select> <select ng-model="setEndMinutes"
							ng-options="o for o in timeMinutes"></select>
					</div>
				</div>


			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
				<button type="button" class="btn btn-primary">Save</button>
			</div>
		</div>
	</div>
	<script type="text/ng-template" id="tpl">
    <div file-browser>
        <input type="file" name="upload-file" ng-model="dataSrc.DSSchema.DSLocation">
    </div>
</script>
</div>
