package com.punarmilan.repository;

import com.punarmilan.entity.ConnectionRequest;
import com.punarmilan.entity.User;
import com.punarmilan.entity.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionRequestRepository extends JpaRepository<ConnectionRequest, Long> {

    List<ConnectionRequest> findAllByReceiverAndStatusAndRequestType(User receiver, RequestStatus status,
            com.punarmilan.entity.enums.RequestType requestType);

    List<ConnectionRequest> findAllBySenderAndStatusAndRequestType(User sender, RequestStatus status,
            com.punarmilan.entity.enums.RequestType requestType);

    List<ConnectionRequest> findAllByReceiverAndStatus(User receiver, RequestStatus status);

    List<ConnectionRequest> findAllBySenderAndStatus(User sender, RequestStatus status);

    List<ConnectionRequest> findAllByReceiver(User receiver);

    List<ConnectionRequest> findAllBySender(User sender);

    Optional<ConnectionRequest> findBySenderAndReceiverAndRequestType(User sender, User receiver,
            com.punarmilan.entity.enums.RequestType requestType);

    boolean existsBySenderAndReceiverAndStatusAndRequestType(User sender, User receiver, RequestStatus status,
            com.punarmilan.entity.enums.RequestType requestType);

    @org.springframework.data.jpa.repository.Query("SELECT cr.receiver.id FROM ConnectionRequest cr WHERE cr.sender = :user AND cr.status = com.punarmilan.entity.enums.RequestStatus.DECLINED")
    java.util.List<Long> findDeclinedReceiverIdsBySender(@org.springframework.data.repository.query.Param("user") User user);

    @org.springframework.data.jpa.repository.Query("SELECT cr.sender.id FROM ConnectionRequest cr WHERE cr.receiver = :user AND cr.status = com.punarmilan.entity.enums.RequestStatus.DECLINED")
    java.util.List<Long> findDeclinedSenderIdsByReceiver(@org.springframework.data.repository.query.Param("user") User user);
}
