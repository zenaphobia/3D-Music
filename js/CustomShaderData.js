const vert = `
void main(){
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);
}
`;

const frag =`
varying vec3 vNormal;
uniform vec3 colorMine;
void main()
{
    vec3 colorMine = vec3(55,0,0);
    gl_FragColor = vec4( colorMine, clamp(sin(u_time / 2.0), 0.5, .75) );
}
`;

export { vert, frag };