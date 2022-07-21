
--insert by population unit
insert
	into
	user_animal_assignment (user_id,
	critter_id,
	created_by_user_id,
	permission_type)
select
	--set user id to desired user
	'##' as user_id,
	a.critter_id ,
	'##' as created_by_user_id ,
	'manager' as permission_type
from
	animal a
where
	a.population_unit in()
	
--insert by wlhid	
insert
	into
	user_animal_assignment (user_id,
	critter_id,
	created_by_user_id,
	permission_type)
select
	--set user id to desired user
	'##' as user_id,
	a.critter_id ,
	'##' as created_by_user_id ,
	'manager' as permission_type
from
	animal a
where
	a.wlh_id in()


--insert by region
insert
	into
	user_animal_assignment (user_id,
	critter_id,
	created_by_user_id,
	permission_type)
select
	--set user id to desired user
	'##' as user_id,
	a.critter_id ,
	'##' as created_by_user_id ,
	'observer' as permission_type
from
	animal a
where
	a.region in('')