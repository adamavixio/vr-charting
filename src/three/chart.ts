import * as THREE from "three";

export const newChart = (scene: THREE.Scene, xs: number, xe: number, ys: number, ye: number, inc: number) => {
	const vertices = 3 * (1 + (xe - xs) / inc) * (1 + (ye - ys) / inc)
	console.log(vertices)

	const xAxisGeo = new THREE.BufferGeometry()
	const xAxisMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
	const xAxis = new THREE.Line(xAxisGeo, xAxisMat);
	scene.add(xAxis)

	const yAxisGeo = new THREE.BufferGeometry()
	const yAxisMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
	const yAxis = new THREE.Line(yAxisGeo, yAxisMat);
	scene.add(yAxis)

	const xGridGeo = new THREE.BufferGeometry()
	const xGridMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 })
	const xGrid = new THREE.Line(xGridGeo, xGridMat);
	scene.add(xGrid)

	const yGridGeo = new THREE.BufferGeometry()
	const yGridMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 })
	const yGrid = new THREE.Line(yGridGeo, yGridMat);
	scene.add(yGrid)

	const graphPoints = new Float32Array(vertices);
	const graphColors = new Float32Array(vertices);
	const graphGeo = new THREE.BufferGeometry()
	const graphMat = new THREE.PointsMaterial({ size: 0.03, vertexColors: true });
	const graph = new THREE.Points(graphGeo, graphMat);
	scene.add(graph);

	return {
		graph,

		axis: () => {
			xAxis.geometry.setFromPoints([
				new THREE.Vector3(xs, 0, 0),
				new THREE.Vector3(xe, 0, 0)
			])

			yAxis.geometry.setFromPoints([
				new THREE.Vector3(0, ys, 0),
				new THREE.Vector3(0, ye, 0)
			])
		},

		grid: () => {
			let xPoints: THREE.Vector3[] = []
			for (let y = ys; y <= ye; y++) {
				xPoints.push(new THREE.Vector3(xs, y, 0))
				xPoints.push(new THREE.Vector3(xe, y, 0))
				xPoints.push(new THREE.Vector3(xs, y, 0))
				if (y !== ye) xPoints.push(new THREE.Vector3(xs, y + 1, 0))
			}
			xGrid.geometry.setFromPoints(xPoints)

			let yPoints: THREE.Vector3[] = []
			for (let x = xs; x <= xe; x++) {
				yPoints.push(new THREE.Vector3(x, ys, 0))
				yPoints.push(new THREE.Vector3(x, ye, 0))
				yPoints.push(new THREE.Vector3(x, ys, 0))
				if (x !== xe) yPoints.push(new THREE.Vector3(x + 1, ys, 0))
			}
			yGrid.geometry.setFromPoints(yPoints)
		},

		points: (func: (x: number, y: number) => number) => {
			let k = 0
			for (let x = xs; x <= xe; x += inc) {
				for (let y = ys; y <= ye; y += inc) {
					graphPoints[3 * k] = x;
					graphPoints[3 * k + 1] = y;
					graphPoints[3 * k + 2] = func(x, y);

					graphColors[3 * k] = 1 + func(x, y)
					graphColors[3 * k + 1] = func(x, y) / 2
					graphColors[3 * k + 2] = 1 - func(x, y)

					k++
				}
			}
			graph.geometry.setAttribute('position', new THREE.BufferAttribute(graphPoints, 3));
			graph.geometry.setAttribute('color', new THREE.BufferAttribute(graphColors, 3));
			graph.geometry.computeBoundingBox();
		}
	}
}
