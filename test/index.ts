import LiteAcl from "../dist/index";

const ac = LiteAcl.getAC();

function run() {
	ac.add({ "3": ["ggfugg"] });
	console.log(ac.view("3"));
	console.log(
		ac.can(["role1", "3", "role2"], ["project.cc.cc", "project.cc.dd", "ewe"], {
			canType: "all"
		})
	);
}

run();
