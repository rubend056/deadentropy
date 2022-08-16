/**
 * App will define Providers, then call on Routes
 */

import animations from 'val-loader?modules!@webapp/assets/animations'
import React, { useEffect, useRef, useState } from 'react'

const App = () => {
	const state = useRef(0)
	const video = useRef<HTMLVideoElement>(null)
	
	const tick = () => {
		if (!video.current) return
		state.current++
		if (state.current > animations.length - 1) state.current = 0
		video.current.src = animations[state.current].v || ''
		
	}
	useEffect(tick, [])
	
	return (
		<>
			
			<video
				style={{ padding: '5% 0', margin: 'auto', width: 1000, height: 2000, display: 'block' }}
				autoPlay={true}
				controls={false}
				onEnded={tick}
				ref={video}
			/>
			{animations.map((a) => (
				<video key={a.name} src={a.v} preload="auto" style={{ opacity: 0, width: 1, height: 1, position:'absolute' }} autoPlay={false}/>
			))}
		</>
	)
}

export default App
