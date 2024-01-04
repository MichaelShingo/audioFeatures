import React, { ReactNode, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { DirectionalLightHelper, Mesh, Vector3 } from 'three';
import { OrbitControls, useHelper } from '@react-three/drei';
import { useControls } from 'leva';
import { actions, useAppState } from '@/app/context/AppStateContext';

function Box(props) {
	const { state, dispatch } = useAppState();
	// This reference will give us direct access to the mesh
	const meshRef = useRef()
	// Set up state for the hovered and active state
	const [hovered, setHover] = useState(false)
	const [active, setActive] = useState(false)
	// Subscribe this component to the render-loop, rotate the mesh every frame
	// useFrame((state, delta) => (meshRef.current.rotation.x += delta))
	// Return view, these are regular three.js elements expressed in JSX
	console.log(typeof state.rms)
	return (
	  <mesh
		{...props}
		ref={meshRef}
		scale={1}
		onClick={(event) => setActive(!active)}
		onPointerOver={(event) => setHover(true)}
		onPointerOut={(event) => setHover(false)}>
		<boxGeometry args={[1, 1, 1]} />
		<meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
	  </mesh>
	)
  }



const Scene = () => {
	const directionalLightRef = useRef();
	const { lightColor, lightIntensity } = useControls({
		lightColor: 'white',
		lightIntensity: {
			value: 0.5,
			min: 0,
			max: 5,
		}
	})
	// if (directionalLightRef) {
	// 	useHelper(directionalLightRef, DirectionalLightHelper, 0.5, 'black' )
	// }
	return ( 
		<>
			<OrbitControls /> 
			</>
		);
}

const generateCubeGrid = (): ReactNode[] => {
	const res: ReactNode[] = [];
	for (let i = 0; i < 3; i++ ) {
		for (let j = 0; i < 3; j++) {
			res.push(<Box position={[i, j, 0]} />)
		}
	}
	return res;
}
 
const ModelCanvas: React.FC = () => {
	return (
		<Canvas>
			<ambientLight intensity={Math.PI / 2} />
			<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
			<pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
			{/* { generateCubeGrid() } */}
			<Box position={[0, 0, 0]} />
			<Box position={[0, 1, 0]} />
			<Box position={[0, 2, 0]} />
			<Scene />
  		</Canvas>
	);
};

export default ModelCanvas;
