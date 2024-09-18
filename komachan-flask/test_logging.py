from flask import Flask
import os
import logging

app = Flask(__name__)

if not os.path.exists('logs'):
    os.makedirs('logs')
logging.basicConfig(
    filename='logs/flask.log',  # 日志文件名
    level=logging.DEBUG,   # 日志级别
    format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s'  # 日志格式
)
logger = logging.getLogger(__name__)

@app.route('/test')
def test():
    logger.info("Test endpoint called")
    return "Hello from Flask!"

if __name__ == '__main__':
    app.run(debug=True)
