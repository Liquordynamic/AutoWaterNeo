#ifdef VERTEX_SHADER

layout (location = 0) in vec3 aPos;
layout (location = 1) in vec2 aTexCoords;

uniform mat4 uMatrix;

out vec2 vTexCoords;

void main()
{
    gl_Position = uMatrix * vec4(aPos.x, aPos.y, 0.0000002, 1.0);
    vTexCoords = aTexCoords;
}

#endif

#ifdef FRAGMENT_SHADER
#define THRESHOLD_VALUE 0.005
precision lowp float;

in vec2 vTexCoords;

uniform float uCurTime;
uniform sampler2D uWaterHeight0;
uniform sampler2D uWaterHeight1;
uniform sampler2D uRampTexture;
uniform sampler2D uMaskTexture;
out vec4 FragColor;

void main() {
    float maskValue = texture(uMaskTexture, vTexCoords).r;
    if(maskValue < 0.001)
        discard;
    float curTime = fract(uCurTime);
    float waterHeight0 = texture(uWaterHeight0, vTexCoords).r;
    float waterHeight1 = texture(uWaterHeight1, vTexCoords).r;
    float waterHeight = mix(waterHeight0, waterHeight1, curTime);
    if(waterHeight <= THRESHOLD_VALUE)
        discard;
    vec3 finalColor = texture(uRampTexture, vec2(waterHeight, 0.5)).rgb;
    FragColor = vec4(finalColor, 0.4);

}

#endif