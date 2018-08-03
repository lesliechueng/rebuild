<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<%@ include file="/_include/Head.jsp"%>
<title>实体管理</title>
<style type="text/css">
.card.entity .card-body{padding:14px 20px}
.card.entity .icon{font-size:40px;}
.card.entity h5,.card.entity p{margin:3px 0;}
.card.entity p{color:#777;font-size:0.9rem;}
</style>
</head>
<body>
<div class="rb-wrapper rb-collapsible-sidebar rb-fixed-sidebar rb-aside">
	<jsp:include page="/_include/NavTop.jsp">
		<jsp:param value="实体管理" name="pageTitle"/>
	</jsp:include>
	<jsp:include page="/_include/NavLeftAdmin.jsp">
		<jsp:param value="entity-list" name="activeNav"/>
	</jsp:include>
	<div class="rb-content">
		<aside class="page-aside">
			<div class="rb-scroller">
				<div class="aside-content">
					<div class="content">
						<div class="aside-header">
							<span class="title">用户</span>
							<p class="description">管理用户</p>
						</div>
					</div>
					<div class="aside-nav collapse">
						<ul class="nav">
							<li><a href="manage.htm"><i class="icon mdi mdi-inbox"></i>基本信息</a></li>
							<li class="active"><a href="manage-fields.htm"><i class="icon mdi mdi-inbox"></i>管理字段</a></li>
							<li><a href="manage-layout.htm"><i class="icon mdi mdi-inbox"></i>管理布局</a></li>
						</ul>
					</div>
				</div>
			</div>
        </aside>
		<div class="main-content container-fluid">
			<div class="card card-table">
				<div class="card-body rb-loading">
					<div class="dataTables_wrapper container-fluid">
						<div class="row rb-datatable-header">
							<div class="col-sm-6">
								<div class="dataTables_filter">
									<div class="input-group input-search">
										<input class="form-control" placeholder="搜索..." type="text"><span class="input-group-btn">
										<button class="btn btn-secondary"><i class="icon zmdi zmdi-search"></i></button></span>
									</div>
								</div>
							</div>
							<div class="col-sm-6">
								<div class="dataTables_oper">
									<button class="btn btn-space btn-primary" onclick="rbModal.show('field-edit.htm')"><i class="icon zmdi zmdi-plus"></i> 新建</button>
									<button class="btn btn-space btn-secondary" disabled="disabled"><i class="icon zmdi zmdi-delete"></i> 删除</button>
								</div>
							</div>
						</div>
						<div class="row rb-datatable-body">
							<div class="col-sm-12">
								<table class="table" id="dataList" data-entity="User">
									<thead>
										<tr>
											<th width="50">
												<label class="custom-control custom-control-sm custom-checkbox">
													<input class="custom-control-input" type="checkbox"><span class="custom-control-label"></span>
												</label>
											</th>
											<th data-filed="loginName">字段名称</th>
											<th data-field="email">内部名称</th>
											<th data-field="createdOn">创建时间</th>
										</tr>
									</thead>
									<tbody></tbody>
								</table>
							</div>
						</div>
						<div class="row rb-datatable-footer">
							<div class="col-sm-5">
								<div class="dataTables_info"></div>
							</div>
							<div class="col-sm-7">
								<div class="dataTables_paginate paging_simple_numbers">
									<ul class="pagination">
										<li class="paginate_button page-item previous disabled"><a href="#" class="page-link"><span class="icon zmdi zmdi-chevron-left"></span></a></li>
										<li class="paginate_button page-item active"><a href="#" class="page-link">1</a></li>
										<li class="paginate_button page-item next"><a href="#" class="page-link"><span class="icon zmdi zmdi-chevron-right"></span></a></li>
									</ul>
								</div>
							</div>
						</div>
					</div>
					<div class="rb-spinner">
						<svg width="40px" height="40px" viewBox="0 0 66 66" xmlns="http://-www.w3.org/2000/svg">
							<circle fill="none" stroke-width="4" stroke-linecap="round" cx="33" cy="33" r="30" class="circle"></circle>
						</svg>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<%@ include file="/_include/Foot.jsp"%>
<script src="${baseUrl}/assets/js/rb-list.js" type="text/javascript"></script>
<script type="text/babel">
const rbModal = ReactDOM.render(<RbModal title="新建字段" />, $('<div id="react-comps"></div>').appendTo(document.body)[0]);
</script>
<script type="text/javascript">
</script>
</body>
</html>
