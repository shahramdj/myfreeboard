import numpy as np
from flask import Flask
from flask import jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/', methods=['GET'])
def mock_robot():
    joint_angles = np.random.uniform(low=-180, high=180, size=(7, 1))
    joint_torques = np.random.uniform(low=-10, high=10, size=(7, 1))
    pose = np.random.uniform(low=-100, high=100, size=(6, 1))
    wrench = np.random.uniform(low=-100, high=100, size=(6, 1))
    data = {
        'joint_angles': joint_angles.tolist(),
        'joint_torques': joint_torques.tolist(),
        'pose': pose.tolist(),
        'wrench': wrench.tolist()
    }
    return jsonify(data)


if __name__ == '__main__':
    app.run(host='YOUR_IP')