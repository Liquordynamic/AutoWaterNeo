
#ifdef VERTEX_SHADER

// #define PI 3.141592653589793
// #define RAD_TO_DEG 180.0 / PI
// #define DEG_TO_RAD PI / 180.0
// #define EarthRadius 6371008.8

layout(location = 0) in vec4 a_pos;
layout(location = 1) in vec3 a_normal;
layout(location = 2) in vec2 a_uv;
layout(location = 3) in vec3 a_translate;
layout(location = 4) in vec4 a_big_pos;
layout(location = 5) in float a_depth;

uniform mat4 u_modelMatrix;
uniform mat4 u_matrix;
uniform float scaleRate;

out vec3 v_normal;
out vec2 v_uv;
out float v_depth;

void main() {
    // vec4 pos = mix(a_BIG_pos, a_pos, pow(clamp(scaleRate + 0.1, 0.0, 1.0), 0.1));

    vec4 transformedPos = mix(u_modelMatrix * a_big_pos, u_modelMatrix * a_pos, pow(clamp(scaleRate + 0.1, 0.0, 1.0), 0.1));
    // transformedPos = u_modelMatrix * a_pos;

    vec4 pos = transformedPos + vec4(a_translate.xy, a_translate.z / 2.0, 0.0);

    vec4 positionInClip = u_matrix * pos;
    gl_Position = positionInClip;

    mat3 normalMat = transpose(inverse(mat3(u_modelMatrix)));

    v_normal = normalMat * a_normal;
    v_uv = a_uv;
    v_depth = a_depth;
}

#endif

#ifdef FRAGMENT_SHADER
precision mediump float;

in vec3 v_normal;
in vec2 v_uv;
in float v_depth;

out vec4 fragColor;

const vec3 lightDirection = vec3(0.0, 1.0, 1.0);
const vec3 lightColor = vec3(0.47);

void main() {

    vec3 baseColor = vec3(0.01, 0.25, 0.56);

    float diff = max(dot(normalize(v_normal), normalize(lightDirection)), 0.0) * 1.0;
    vec3 diffuse = diff * lightColor;

    float depth = abs(v_normal.z) > 0.99 ? v_normal.z * 0.5 + 0.5 : v_uv.y;

    float segmentDepth = step(depth, v_depth / 10.0);
    vec3 finalColor = mix(baseColor * 0.2, baseColor, segmentDepth);
    fragColor = vec4(finalColor + diffuse, 1.0);

}

#endif