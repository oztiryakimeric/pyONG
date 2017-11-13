import redis


class Connection:
    instance = None

    @staticmethod
    def get_instance():
        if not Connection.instance:
            Connection.instance = Connection.connect(host='localhost', port=6379, db=0)  # host='localhost', port=6379, db=0
        return Connection.instance

    @staticmethod
    def connect(host, port, db):
        return redis.Redis(host=host, port=port, db=db)